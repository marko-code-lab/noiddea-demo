/**
 * Actions para gestión de productos
 */

import { getServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';
import { generateId } from '@/lib/database';
import { logger } from '@/lib/logger';

/**
 * Crea un nuevo producto con sus presentaciones
 */
export async function createProduct(data: {
  branchId: string;
  name: string;
  description?: string;
  expiration?: string; // ISO date string (timestampz)
  brand?: string;
  barcode?: string;
  sku?: string;
  cost: number;
  price: number;
  stock?: number;
  bonification?: number;
  presentations: Array<{
    variant: string;
    units: number;
    price?: number;
  }>;
}) {
  try {
    // Validar datos básicos (presentaciones ahora son opcionales, "unidad" se crea automáticamente)
    if (!data.branchId || !data.name) {
      return {
        success: false,
        error: 'Branch ID y nombre del producto son requeridos',
      };
    }

    // Obtener usuario autenticado
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener el negocio del usuario
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    // Verificar que tenga permisos
    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear productos',
      };
    }

    // ELIMINADO: Verificación de branch
    // Ahora branchId = businessId directamente
    // Solo verificamos que el branchId sea igual al business_id del usuario
    if (data.branchId !== businessUser.business_id) {
      return {
        success: false,
        error: 'El business_id no coincide con tu negocio',
      };
    }

    // Usar business_id directamente como branch_id
    const branchId = businessUser.business_id;

    // Crear producto y presentaciones en una transacción
    const productId = generateId();
    const now = new Date().toISOString();

    // Preparar presentaciones
    const presentations = [
      // Presentación base "unidad" con el precio base del producto
      {
        id: generateId(),
        product_id: productId,
        variant: 'unidad',
        units: 1,
        price: data.price,
        is_active: 1,
      },
      // Presentaciones adicionales
      ...data.presentations.map(p => ({
        id: generateId(),
        product_id: productId,
        variant: p.variant.trim(),
        units: p.units,
        price: p.price || data.price,
        is_active: 1,
      })),
    ];

    const presentationOps = presentations.map(p => ({
      sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [p.id, p.product_id, p.variant, p.units, p.price, p.is_active, now, now],
    }));

    await db.transact([
      {
        sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          productId,
          branchId, // Usar business_id directamente
          data.name.trim(),
          data.description?.trim() || null,
          data.expiration || null,
          data.brand?.trim() || null,
          data.barcode?.trim() || null,
          data.sku?.trim() || null,
          data.cost,
          data.price,
          data.stock || 0,
          data.bonification || 0,
          session.userId,
          1,
          now,
          now,
        ],
      },
      ...presentationOps,
    ]);

    const product = await db.selectOne<any>(
      `SELECT * FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    console.log('✅ Producto creado:', productId, product?.name);

    return {
      success: true,
      productId: productId,
      productName: product?.name || data.name,
    };
  } catch (error) {
    console.error('❌ Error en createProduct:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene todos los productos de un negocio con sus presentaciones
 * Si se proporciona branchId, filtra por productos creados en esa sucursal
 * Soporta paginación para mejor rendimiento con grandes volúmenes de datos
 */
export async function getProducts(
  branchId?: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
  }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado', products: [] };
    }

    const db = getDatabaseClient();

    let businessId: string | null = null;

    // OPTIMIZACIÓN: Hacer ambas consultas en paralelo
    const [businessUser, branchUser] = await Promise.all([
      db.selectOne<{ business_id: string }>(
        `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
        [session.userId]
      ),
      db.selectOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [session.userId]
      ),
    ]);

    if (businessUser) {
      businessId = businessUser.business_id;
    } else if (branchUser) {
      businessId = branchUser.business_id;
    }

    if (!businessId) {
      return {
        success: false,
        error: 'No tienes un negocio asociado',
        products: [],
      };
    }

    // Verificar que el business existe
    const business = await db.selectOne<{ id: string; name: string }>(
      `SELECT id, name FROM businesses WHERE id = ? LIMIT 1`,
      [businessId]
    );

    if (!business) {
      return {
        success: false,
        error: 'Negocio no encontrado',
        products: [],
      };
    }

    // MIGRACIÓN: Actualizar productos existentes que tengan branch_id diferente al business_id
    // Buscar productos que pertenezcan a branches de este business y actualizarlos
    // Si la tabla branches existe, migrar productos; si no, continuar (productos ya deberían tener business_id)
    try {
      // Primero verificar si hay productos con branch_id que pertenezcan a branches de este business
      const productsToMigrate = await db.select<{ id: string }>(
        `SELECT p.id 
         FROM products p 
         INNER JOIN branches b ON b.id = p.branch_id 
         WHERE b.business_id = ? AND p.branch_id != ? LIMIT 100`,
        [businessId, businessId]
      );

      if (productsToMigrate.length > 0) {
        console.log('[getProducts] Migrando', productsToMigrate.length, 'productos para usar business_id directamente');
        for (const product of productsToMigrate) {
          await db.mutate(`UPDATE products SET branch_id = ? WHERE id = ?`, [businessId, product.id]);
        }
        console.log('[getProducts] Migración completada');
      }
    } catch (error) {
      // Si falla (por ejemplo, si la tabla branches no existe o está vacía), continuar
      // Esto es normal si ya no hay branches
      console.log('[getProducts] No se pudo migrar productos (puede ser normal si no hay branches):', error);
    }

    // Construir query base - buscar productos de todos los branches del business
    // Usar JOIN con branches para obtener productos que pertenezcan a branches del business
    let sql = `SELECT p.* FROM products p 
               LEFT JOIN branches b ON b.id = p.branch_id
               WHERE p.is_active = 1 AND (p.branch_id = ? OR b.business_id = ?)`;
    let countSql = `SELECT COUNT(*) as total FROM products p 
                    LEFT JOIN branches b ON b.id = p.branch_id
                    WHERE p.is_active = 1 AND (p.branch_id = ? OR b.business_id = ?)`;
    const params: any[] = [businessId, businessId];
    const countParams: any[] = [businessId, businessId];

    // Ya no filtramos por branchId específico - obtenemos todos los productos del business
    // branchId ahora es tratado como businessId (compatibilidad)

    // Búsqueda por texto (nombre, descripción, marca)
    if (options?.search) {
      const searchTerm = `%${options.search.toLowerCase()}%`;
      sql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.brand) LIKE ?)`;
      countSql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.brand) LIKE ?)`;
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Paginación
    const page = Math.max(1, Math.floor(options?.page || 1));
    const limit = Math.max(1, Math.floor(options?.limit || 50));
    const offset = Math.max(0, (page - 1) * limit);

    // SQLite requiere que LIMIT y OFFSET sean valores literales, no parámetros
    // Aseguramos que son enteros para evitar inyección SQL
    sql += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    // Ejecutar queries
    const [products, countResult] = await Promise.all([
      db.select<any>(sql, params),
      db.selectOne<{ total: number }>(countSql, countParams),
    ]);

    // Optimización: Obtener todas las presentaciones en una sola query (evita N+1)
    const productIds = products.map((p: any) => p.id);
    const presentationsMap = new Map<string, any[]>();

    if (productIds.length > 0) {
      const placeholders = productIds.map(() => '?').join(',');
      const allPresentations = await db.select<any>(
        `SELECT * FROM product_presentations WHERE product_id IN (${placeholders}) AND is_active = 1`,
        productIds
      );

      for (const presentation of allPresentations || []) {
        const productId = presentation.product_id;
        if (!presentationsMap.has(productId)) {
          presentationsMap.set(productId, []);
        }
        presentationsMap.get(productId)!.push(presentation);
      }
    }

    const productsWithPresentations = products.map((product: any) => ({
      ...product,
      product_presentations: presentationsMap.get(product.id) || [],
    }));

    const total = countResult?.total || 0;

    return {
      success: true,
      products: productsWithPresentations || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error('Error en getProducts', error, { branchId, options });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      products: [],
    };
  }
}

/**
 * Obtiene un producto específico por ID
 * Evita consultas N+1 al obtener todos los productos
 */
export async function getProductById(productId: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado', product: null };
    }

    const db = getDatabaseClient();

    // Obtener producto directamente por ID
    const product = await db.selectOne<any>(
      `SELECT * FROM products WHERE id = ? AND is_active = 1 LIMIT 1`,
      [productId]
    );

    if (!product) {
      return {
        success: false,
        error: 'Producto no encontrado',
        product: null,
      };
    }

    // Obtener presentaciones del producto
    const presentations = await db.select<any>(
      `SELECT * FROM product_presentations WHERE product_id = ? AND is_active = 1`,
      [productId]
    );

    // Verificar que el usuario tenga acceso al negocio del producto
    let businessId: string | null = null;

    const [businessUser, branchUser] = await Promise.all([
      db.selectOne<{ business_id: string }>(
        `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
        [session.userId]
      ),
      db.selectOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [session.userId]
      ),
    ]);

    if (businessUser) {
      businessId = businessUser.business_id;
    } else if (branchUser) {
      businessId = branchUser.business_id;
    }

    // Obtener el business_id del producto a través de la branch
    const productBranch = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM branches WHERE id = ? LIMIT 1`,
      [product.branch_id]
    );

    if (!productBranch || productBranch.business_id !== businessId) {
      return {
        success: false,
        error: 'No tienes acceso a este producto',
        product: null,
      };
    }

    return {
      success: true,
      product: {
        ...product,
        product_presentations: presentations || [],
      },
    };
  } catch (error) {
    logger.error('Error en getProductById', error, { productId });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      product: null,
    };
  }
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(
  productId: string,
  data: {
    name?: string;
    description?: string;
    expiration?: string; // ISO date string (timestampz)
    brand?: string;
    barcode?: string;
    sku?: string;
    stock?: number;
    cost?: number;
    price?: number;
    bonification?: number;
    is_active?: boolean;
  }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Verificar permisos del usuario
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para actualizar productos',
      };
    }

    // Construir query de actualización
    const updateFields: string[] = [];
    const updateParams: any[] = [];

    if (data.name !== undefined) {
      updateFields.push('name = ?');
      updateParams.push(data.name.trim());
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(data.description.trim() || null);
    }
    if (data.expiration !== undefined) {
      updateFields.push('expiration = ?');
      updateParams.push(data.expiration || null);
    }
    if (data.brand !== undefined) {
      updateFields.push('brand = ?');
      updateParams.push(data.brand.trim() || null);
    }
    if (data.barcode !== undefined) {
      updateFields.push('barcode = ?');
      updateParams.push(data.barcode.trim() || null);
    }
    if (data.sku !== undefined) {
      updateFields.push('sku = ?');
      updateParams.push(data.sku.trim() || null);
    }
    if (data.stock !== undefined) {
      updateFields.push('stock = ?');
      updateParams.push(data.stock);
    }
    if (data.cost !== undefined) {
      updateFields.push('cost = ?');
      updateParams.push(data.cost);
    }
    if (data.price !== undefined) {
      updateFields.push('price = ?');
      updateParams.push(data.price);
    }
    if (data.bonification !== undefined) {
      updateFields.push('bonification = ?');
      updateParams.push(data.bonification);
    }
    if (data.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(data.is_active ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return { success: false, error: 'No hay campos para actualizar' };
    }

    updateFields.push('updated_at = ?');
    updateParams.push(new Date().toISOString());
    updateParams.push(productId);

    await db.mutate(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    // Si se actualizó el precio base, actualizar también la presentación "unidad"
    if (data.price !== undefined) {
      try {
        await db.mutate(
          `UPDATE product_presentations SET price = ?, updated_at = ? WHERE product_id = ? AND variant = ?`,
          [data.price, new Date().toISOString(), productId, 'unidad']
        );
        console.log('✅ Presentación "unidad" actualizada con nuevo precio:', data.price);
      } catch (unitPresentationError) {
        console.error('⚠️ Error actualizando presentación unidad:', unitPresentationError);
        // No retornar error, el producto principal ya se actualizó
      }
    }

    console.log('✅ Producto actualizado:', productId);

    return { success: true };
  } catch (error) {
    console.error('❌ Error en updateProduct:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza las presentaciones de un producto
 */
export async function updateProductPresentations(
  productId: string,
  presentations: Array<{
    id?: string;
    variant: string;
    units: number;
    price?: number;
  }>
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Verificar permisos
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para actualizar presentaciones',
      };
    }

    // 1. Obtener presentaciones existentes (excluyendo "unidad")
    // La presentación "unidad" nunca se edita ni elimina
    const existingPresentations = await db.select<{ id: string; variant: string }>(
      `SELECT id, variant FROM product_presentations WHERE product_id = ? AND variant != ?`,
      [productId, 'unidad']
    );

    const existingIds = existingPresentations?.map(p => p.id) || [];
    const updatingIds = presentations.filter(p => p.id).map(p => p.id!);

    // 2. Eliminar presentaciones que ya no están en la lista
    const toDelete = existingIds.filter(id => !updatingIds.includes(id));
    if (toDelete.length > 0) {
      const deletePlaceholders = toDelete.map(() => '?').join(',');
      await db.mutate(
        `DELETE FROM product_presentations WHERE id IN (${deletePlaceholders})`,
        toDelete
      );
    }

    // 3. Actualizar o crear presentaciones usando transacción
    const toUpdate = presentations.filter(p => p.id);
    const toInsert = presentations.filter(p => !p.id);

    const updateOps: Array<{ sql: string; params: any[] }> = [];
    const insertOps: Array<{ sql: string; params: any[] }> = [];
    const now = new Date().toISOString();

    // Actualizar todas las presentaciones existentes
    for (const presentation of toUpdate) {
      updateOps.push({
        sql: `UPDATE product_presentations SET variant = ?, units = ?, price = ?, updated_at = ? WHERE id = ?`,
        params: [
          presentation.variant,
          presentation.units,
          presentation.price || null,
          now,
          presentation.id!,
        ],
      });
    }

    // Insertar todas las nuevas presentaciones
    for (const presentation of toInsert) {
      const presentationId = generateId();
      insertOps.push({
        sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          presentationId,
          productId,
          presentation.variant,
          presentation.units,
          presentation.price || null,
          1,
          now,
          now,
        ],
      });
    }

    // Ejecutar todas las operaciones en una transacción
    if (updateOps.length > 0 || insertOps.length > 0) {
      await db.transact([...updateOps, ...insertOps]);
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Error actualizando presentaciones:', error);
    return { success: false, error: 'Error actualizando presentaciones' };
  }
}

/**
 * Elimina un producto (soft delete)
 */
export async function deleteProduct(productId: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Verificar permisos - solo owners pueden gestionar productos
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    let businessId: string | null = null;
    let hasPermission = false;

    if (businessUser && businessUser.role === 'owner') {
      businessId = businessUser.business_id;
      hasPermission = true;
    }

    if (!hasPermission || !businessId) {
      return {
        success: false,
        error: 'No tienes permisos para eliminar productos. Solo los owners pueden eliminar productos.',
      };
    }

    // Verificar que el producto existe
    const product = await db.selectOne<{ id: string; branch_id: string }>(
      `SELECT id, branch_id FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    if (!product) {
      return { success: false, error: 'Producto no encontrado' };
    }

    // Verificar que la sucursal del producto pertenece al negocio del usuario
    // Un producto pertenece al negocio si:
    // 1. branch_id = businessId (productos antiguos/migrados)
    // 2. O existe un branch con ese branch_id que pertenezca al business
    if (product.branch_id !== businessId) {
      const branch = await db.selectOne<{ business_id: string }>(
        `SELECT business_id FROM branches WHERE id = ? LIMIT 1`,
        [product.branch_id]
      );

      if (!branch || branch.business_id !== businessId) {
        return {
          success: false,
          error: 'No tienes permisos para eliminar este producto',
        };
      }
    }

    // Soft delete: marcar como inactivo en una transacción
    console.log('🗑️ Intentando eliminar producto:', productId);

    const now = new Date().toISOString();

    await db.transact([
      {
        sql: `UPDATE products SET is_active = ?, updated_at = ? WHERE id = ?`,
        params: [0, now, productId],
      },
      {
        sql: `UPDATE product_presentations SET is_active = ?, updated_at = ? WHERE product_id = ?`,
        params: [0, now, productId],
      },
    ]);

    console.log('✅ Producto eliminado correctamente (soft delete)');
    return { success: true };
  } catch (error) {
    console.error('❌ Error en deleteProduct:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina múltiples productos a la vez
 */
export async function deleteProducts(productIds: string[]) {
  try {
    if (!productIds || productIds.length === 0) {
      return { success: false, error: 'No se proporcionaron productos para eliminar' };
    }

    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Verificar permisos - solo owners pueden gestionar productos
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    let businessId: string | null = null;
    let hasPermission = false;

    if (businessUser && businessUser.role === 'owner') {
      businessId = businessUser.business_id;
      hasPermission = true;
    }

    if (!hasPermission || !businessId) {
      return {
        success: false,
        error: 'No tienes permisos para eliminar productos. Solo los owners pueden eliminar productos.',
      };
    }

    // Verificar que todos los productos pertenezcan al negocio del usuario
    const placeholders = productIds.map(() => '?').join(',');
    const products = await db.select<{ id: string; branch_id: string }>(
      `SELECT id, branch_id FROM products WHERE id IN (${placeholders})`,
      productIds
    );

    if (!products || products.length === 0) {
      return { success: false, error: 'Error verificando productos' };
    }

    // Verificar que todos los productos pertenezcan al negocio
    // Un producto pertenece al negocio si:
    // 1. branch_id = businessId (productos antiguos/migrados)
    // 2. O existe un branch con ese branch_id que pertenezca al business
    const branchIds = [...new Set(products.map(p => p.branch_id).filter(id => id !== businessId))];

    // Obtener todos los branches válidos en una sola consulta
    let validBranchIds: Set<string> = new Set();
    if (branchIds.length > 0) {
      const branchPlaceholders = branchIds.map(() => '?').join(',');
      const branches = await db.select<{ id: string; business_id: string }>(
        `SELECT id, business_id FROM branches WHERE id IN (${branchPlaceholders})`,
        branchIds
      );
      validBranchIds = new Set(
        branches.filter(b => b.business_id === businessId).map(b => b.id)
      );
    }

    // Verificar cada producto
    const invalidProducts = products.filter(p => {
      // Si branch_id es igual al businessId, es válido (productos antiguos/migrados)
      if (p.branch_id === businessId) {
        return false;
      }
      // Si no, verificar que existe un branch válido con ese ID
      return !validBranchIds.has(p.branch_id);
    });

    if (invalidProducts.length > 0) {
      return {
        success: false,
        error: 'Algunos productos no pertenecen a tu negocio',
      };
    }

    // Eliminar todos los productos (soft delete) en una transacción
    const now = new Date().toISOString();
    const deleteOps: Array<{ sql: string; params: any[] }> = [];

    // Actualizar productos
    for (const productId of productIds) {
      deleteOps.push({
        sql: `UPDATE products SET is_active = ?, updated_at = ? WHERE id = ?`,
        params: [0, now, productId],
      });
      // Actualizar presentaciones de cada producto
      deleteOps.push({
        sql: `UPDATE product_presentations SET is_active = ?, updated_at = ? WHERE product_id = ?`,
        params: [0, now, productId],
      });
    }

    await db.transact(deleteOps);

    console.log('✅ Productos eliminados correctamente (soft delete):', productIds.length);

    return {
      success: true,
      deletedCount: productIds.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Importa todos los productos de una sucursal a otra
 * Todos los productos importados tendrán stock 0
 */
export async function importProductsFromBranch(data: {
  sourceBranchId: string;
  targetBranchId: string;
}) {
  try {
    // Validar datos
    if (!data.sourceBranchId || !data.targetBranchId) {
      return {
        success: false,
        error: 'Las sucursales de origen y destino son requeridas',
      };
    }

    if (data.sourceBranchId === data.targetBranchId) {
      return {
        success: false,
        error: 'No puedes importar productos de la misma sucursal',
      };
    }

    // Obtener usuario autenticado
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener el negocio del usuario
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    // Verificar que tenga permisos
    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para importar productos',
      };
    }

    // Verificar que ambas sucursales pertenezcan al negocio
    const branches = await db.select<{ id: string; business_id: string; name: string }>(
      `SELECT id, business_id, name FROM branches WHERE id IN (?, ?) AND business_id = ?`,
      [data.sourceBranchId, data.targetBranchId, businessUser.business_id]
    );

    if (!branches || branches.length !== 2) {
      return {
        success: false,
        error: 'Las sucursales no existen o no pertenecen a tu negocio',
      };
    }

    const sourceBranch = branches.find(b => b.id === data.sourceBranchId);
    const targetBranch = branches.find(b => b.id === data.targetBranchId);

    if (!sourceBranch || !targetBranch) {
      return {
        success: false,
        error: 'No se encontraron las sucursales especificadas',
      };
    }

    // Obtener todos los productos activos de la sucursal origen
    const sourceProducts = await db.select<any>(
      `SELECT * FROM products WHERE branch_id = ? AND is_active = 1`,
      [data.sourceBranchId]
    );

    if (!sourceProducts || sourceProducts.length === 0) {
      return {
        success: false,
        error: 'No hay productos para importar en la sucursal seleccionada',
      };
    }

    // Obtener presentaciones para cada producto
    const sourceProductsWithPresentations = await Promise.all(
      sourceProducts.map(async (product) => {
        const presentations = await db.select<any>(
          `SELECT * FROM product_presentations WHERE product_id = ? AND is_active = 1`,
          [product.id]
        );
        return {
          ...product,
          product_presentations: presentations || [],
        };
      })
    );

    let importedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Importar cada producto
    for (const sourceProduct of sourceProductsWithPresentations) {
      try {
        // Validar que el producto tenga los campos requeridos
        if (!sourceProduct.name) {
          console.error(`❌ Producto sin nombre:`, sourceProduct);
          errorCount++;
          errors.push(`Producto sin nombre (ID: ${sourceProduct.id})`);
          continue;
        }

        const newProductId = generateId();
        const now = new Date().toISOString();

        // Crear el producto en la sucursal destino con stock 0
        const cost = sourceProduct.cost !== undefined && sourceProduct.cost !== null ? sourceProduct.cost : 0;
        const price = sourceProduct.price !== undefined && sourceProduct.price !== null ? sourceProduct.price : 0;

        // Obtener las presentaciones del producto origen
        const presentations = sourceProduct.product_presentations || [];
        console.log(`📦 Producto ${sourceProduct.name}: ${presentations.length} presentaciones encontradas`);
        if (presentations.length > 0) {
          console.log('🔍 Estructura de la primera presentación:', JSON.stringify(presentations[0], null, 2));
        }

        // Siempre crear al menos la presentación "unidad" si no hay presentaciones
        // o si las presentaciones existentes usan el formato antiguo (variant/units)
        let presentationsData: any[] = [];

        if (presentations.length > 0) {
          // Mapear presentaciones: la base de datos usa variant/units, no name/unit
          presentationsData = presentations
            .filter((p: any) => p.is_active !== false)
            .map((p: any) => {
              // La base de datos real usa variant y units
              let presentationVariant: string;
              let presentationUnits: number;

              if (p.variant && p.units !== undefined) {
                // Formato correcto: variant/units
                presentationVariant = p.variant;
                presentationUnits = p.units;
              } else if (p.name && p.unit !== undefined) {
                // Si viene con name/unit (del schema desactualizado), convertir a variant/units
                presentationVariant = p.name;
                // Intentar extraer units de unit (ej: "unidad x6" -> 6)
                const unitMatch = p.unit.match(/x(\d+)/);
                presentationUnits = unitMatch ? parseInt(unitMatch[1]) : 1;
              } else {
                // Fallback: usar valores por defecto
                console.warn(`⚠️ Presentación con formato desconocido para ${sourceProduct.name}:`, p);
                presentationVariant = 'unidad';
                presentationUnits = 1;
              }

              // Usar variant y units como en la base de datos real
              return {
                id: generateId(),
                product_id: newProductId,
                variant: presentationVariant,
                units: presentationUnits,
                price: p.price !== undefined && p.price !== null ? p.price : price,
                is_active: 1,
                created_at: now,
                updated_at: now,
              };
            });
        } else {
          // Si no hay presentaciones, crear la presentación "unidad" por defecto
          presentationsData = [
            {
              id: generateId(),
              product_id: newProductId,
              variant: 'unidad',
              units: 1,
              price: price,
              is_active: 1,
              created_at: now,
              updated_at: now,
            },
          ];
        }

        // Crear producto y presentaciones en una transacción
        const presentationOps = presentationsData.map(p => ({
          sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [p.id, p.product_id, p.variant, p.units, p.price, p.is_active, p.created_at, p.updated_at],
        }));

        try {
          await db.transact([
            {
              sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              params: [
                newProductId,
                data.targetBranchId,
                sourceProduct.name.trim(),
                sourceProduct.description?.trim() || null,
                sourceProduct.expiration || null,
                sourceProduct.brand?.trim() || null,
                sourceProduct.barcode?.trim() || null,
                sourceProduct.sku?.trim() || null,
                cost,
                price,
                0, // Stock inicial 0 para productos importados
                sourceProduct.bonification || 0,
                session.userId,
                1,
                now,
                now,
              ],
            },
            ...presentationOps,
          ]);

          console.log(`✅ Producto importado: ${sourceProduct.name}`);
          importedCount++;
        } catch (productError) {
          console.error(`❌ Error creando producto ${sourceProduct.name}:`, productError);
          errorCount++;
          errors.push(`${sourceProduct.name}: ${productError instanceof Error ? productError.message : 'Error desconocido'}`);
          continue;
        }
      } catch (error) {
        console.error(`❌ Error importando producto ${sourceProduct.name}:`, error);
        errorCount++;
        errors.push(
          `${sourceProduct.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`
        );
      }
    }

    console.log(
      `✅ Importación completada: ${importedCount} productos importados, ${errorCount} errores`
    );

    return {
      success: true,
      importedCount,
      errorCount,
      totalProducts: sourceProductsWithPresentations.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('❌ Error en importProductsFromBranch:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Transfiere stock de un producto de una sucursal a otra
 * Si el producto no existe en la sucursal destino, lo crea
 */
export async function transferProductStock(data: {
  productId: string;
  sourceBranchId: string;
  targetBranchId: string;
  quantity: number;
  targetProductId?: string; // ID del producto destino si ya existe
  newProductName?: string; // Nombre del nuevo producto si se va a crear
  newProductDescription?: string; // Descripción del nuevo producto
  createIfNotExists?: boolean;
}) {
  try {
    // Validar datos
    if (!data.productId || !data.sourceBranchId || !data.targetBranchId || !data.quantity) {
      return {
        success: false,
        error: 'Todos los campos son requeridos',
      };
    }

    if (data.quantity <= 0) {
      return {
        success: false,
        error: 'La cantidad debe ser mayor a 0',
      };
    }

    if (data.sourceBranchId === data.targetBranchId) {
      return {
        success: false,
        error: 'No puedes transferir a la misma sucursal',
      };
    }

    // Obtener usuario autenticado
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener el negocio del usuario
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    // Verificar que tenga permisos
    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para transferir productos',
      };
    }

    // Verificar que ambas sucursales pertenezcan al negocio
    const branches = await db.select<{ id: string; business_id: string; name: string }>(
      `SELECT id, business_id, name FROM branches WHERE id IN (?, ?) AND business_id = ?`,
      [data.sourceBranchId, data.targetBranchId, businessUser.business_id]
    );

    if (!branches || branches.length !== 2) {
      return {
        success: false,
        error: 'Las sucursales no existen o no pertenecen a tu negocio',
      };
    }

    // Obtener el producto de la sucursal origen
    const sourceProduct = await db.selectOne<any>(
      `SELECT * FROM products WHERE id = ? AND branch_id = ? LIMIT 1`,
      [data.productId, data.sourceBranchId]
    );

    if (!sourceProduct) {
      return {
        success: false,
        error: 'El producto no existe en la sucursal origen',
      };
    }

    // Verificar que hay suficiente stock
    const currentStock = sourceProduct.stock || 0;
    if (currentStock < data.quantity) {
      return {
        success: false,
        error: `Stock insuficiente. Disponible: ${currentStock} unidades`,
      };
    }

    let targetProduct: any = null;

    // Si se proporciona un targetProductId, usar ese producto
    if (data.targetProductId) {
      const product = await db.selectOne<any>(
        `SELECT * FROM products WHERE id = ? AND branch_id = ? LIMIT 1`,
        [data.targetProductId, data.targetBranchId]
      );

      if (!product) {
        return {
          success: false,
          error: 'El producto destino seleccionado no existe',
        };
      }

      targetProduct = product;
    } else if (data.newProductName) {
      // Si se proporciona un nombre para crear, crear el producto
      if (!data.createIfNotExists) {
        return {
          success: false,
          error: 'Debes activar la opción para crear el producto',
        };
      }

      // Crear el producto en la sucursal destino
      const newProductId = generateId();
      const now = new Date().toISOString();

      await db.mutate(
        `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newProductId,
          data.targetBranchId,
          data.newProductName.trim(),
          data.newProductDescription?.trim() || sourceProduct.description || null,
          sourceProduct.expiration || null,
          sourceProduct.brand || null,
          sourceProduct.barcode || null,
          sourceProduct.sku || null,
          sourceProduct.cost || 0,
          sourceProduct.price || 0,
          data.quantity,
          sourceProduct.bonification || 0,
          session.userId,
          1,
          now,
          now,
        ]
      );

      // Copiar las presentaciones del producto origen
      const sourcePresentations = await db.select<any>(
        `SELECT * FROM product_presentations WHERE product_id = ?`,
        [sourceProduct.id]
      );

      if (sourcePresentations && sourcePresentations.length > 0) {
        const presentationOps = sourcePresentations.map((pres: any) => ({
          sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [
            generateId(),
            newProductId,
            pres.variant,
            pres.units,
            pres.price || 0,
            pres.is_active !== undefined ? (pres.is_active ? 1 : 0) : 1,
            now,
            now,
          ],
        }));

        await db.transact(presentationOps);
      }

      // Restar stock de la sucursal origen en una transacción
      await db.transact([
        {
          sql: `UPDATE products SET stock = ?, updated_at = ? WHERE id = ?`,
          params: [currentStock - data.quantity, now, data.productId],
        },
      ]);

      return {
        success: true,
        message: `Producto "${data.newProductName}" creado en destino y ${data.quantity} unidades transferidas`,
      };
    } else {
      // Si no se proporcionó targetProductId ni newProductName, buscar por nombre/barcode
      const existingProducts = await db.select<any>(
        `SELECT * FROM products WHERE branch_id = ? AND is_active = 1`,
        [data.targetBranchId]
      );

      targetProduct = existingProducts?.find(
        (p: any) => p.name === sourceProduct.name || (sourceProduct.barcode && p.barcode === sourceProduct.barcode)
      );

      if (!targetProduct) {
        // El producto no existe en destino
        if (!data.createIfNotExists) {
          return {
            success: false,
            error: 'El producto no existe en la sucursal destino. Selecciona un producto o crea uno nuevo.',
          };
        }

        // Crear el producto con el nombre del origen
        const newProductId = generateId();
        const now = new Date().toISOString();

        // Copiar las presentaciones del producto origen primero
        const sourcePresentations = await db.select<any>(
          `SELECT * FROM product_presentations WHERE product_id = ?`,
          [sourceProduct.id]
        );

        const presentationOps = sourcePresentations.map((pres: any) => ({
          sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [
            generateId(),
            newProductId,
            pres.variant,
            pres.units,
            pres.price || 0,
            pres.is_active !== undefined ? (pres.is_active ? 1 : 0) : 1,
            now,
            now,
          ],
        }));

        // Crear producto y presentaciones en una transacción
        await db.transact([
          {
            sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at, updated_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              newProductId,
              data.targetBranchId,
              sourceProduct.name,
              sourceProduct.description || null,
              sourceProduct.expiration || null,
              sourceProduct.brand || null,
              sourceProduct.barcode || null,
              sourceProduct.sku || null,
              sourceProduct.cost || 0,
              sourceProduct.price || 0,
              data.quantity,
              sourceProduct.bonification || 0,
              session.userId,
              1,
              now,
              now,
            ],
          },
          ...presentationOps,
          {
            sql: `UPDATE products SET stock = ?, updated_at = ? WHERE id = ?`,
            params: [currentStock - data.quantity, now, data.productId],
          },
        ]);

        return {
          success: true,
          message: `Producto creado en destino y ${data.quantity} unidades transferidas`,
        };
      }
      // El producto existe en destino, solo actualizar stock
      const targetStock = targetProduct.stock || 0;

      // Sumar stock a destino y restar de origen en una transacción
      const now = new Date().toISOString();
      await db.transact([
        {
          sql: `UPDATE products SET stock = ?, updated_at = ? WHERE id = ?`,
          params: [targetStock + data.quantity, now, targetProduct.id],
        },
        {
          sql: `UPDATE products SET stock = ?, updated_at = ? WHERE id = ?`,
          params: [currentStock - data.quantity, now, data.productId],
        },
      ]);

      return {
        success: true,
        message: `${data.quantity} unidades transferidas exitosamente`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Importa productos desde un archivo Excel
 * El archivo debe tener las siguientes columnas:
 * - nombre (requerido)
 * - descripcion (opcional)
 * - marca (opcional)
 * - codigo_barras (opcional)
 * - sku (opcional)
 * - costo (requerido)
 * - precio (requerido)
 * - stock (opcional, default 0)
 * - bonificacion (opcional, default 0)
 * - fecha_vencimiento (opcional, formato: YYYY-MM-DD)
 * - presentaciones (opcional, formato: "variante:unidades:precio" separadas por "|")
 */
export async function importProductsFromExcel(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const branchId = formData.get('branchId') as string;

    if (!file) {
      return {
        success: false,
        error: 'No se proporcionó ningún archivo',
      };
    }

    if (!branchId) {
      return {
        success: false,
        error: 'No se proporcionó el ID de la sucursal',
      };
    }

    // Validar que sea un archivo Excel
    const validExtensions = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
    ];

    if (!validExtensions.includes(file.type) && !file.name.match(/\.(xlsx|xls|xlsm)$/i)) {
      return {
        success: false,
        error: 'El archivo debe ser un Excel (.xlsx, .xls, .xlsm)',
      };
    }

    // Obtener usuario autenticado
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener el negocio del usuario
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    // Verificar que tenga permisos
    if (businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para importar productos',
      };
    }

    // Verificar que el branch pertenezca al negocio
    // Si branchId es igual a business_id, buscar el primer branch del business
    let actualBranchId = branchId;
    let branch = await db.selectOne<{ id: string; business_id: string }>(
      `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
      [branchId, businessUser.business_id]
    );

    // Si no se encontró el branch y branchId es igual a business_id,
    // buscar el primer branch del business
    if (!branch && branchId === businessUser.business_id) {
      const firstBranch = await db.selectOne<{ id: string; business_id: string }>(
        `SELECT id, business_id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessUser.business_id]
      );
      if (firstBranch) {
        branch = firstBranch;
        actualBranchId = firstBranch.id;
      } else {
        // Si no existe ningún branch, crear uno por defecto usando los datos del business
        const business = await db.selectOne<{ id: string; name: string; description: string | null }>(
          `SELECT id, name, description FROM businesses WHERE id = ? LIMIT 1`,
          [businessUser.business_id]
        );

        if (business) {
          const defaultBranchId = generateId();
          await db.mutate(
            `INSERT INTO branches (id, business_id, name, location, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              defaultBranchId,
              business.id,
              business.name,
              business.description || business.name,
              null,
              new Date().toISOString(),
            ]
          );
          branch = { id: defaultBranchId, business_id: business.id };
          actualBranchId = defaultBranchId;
          console.log(`✅ Branch por defecto creado automáticamente: ${defaultBranchId}`);
        }
      }
    }

    if (!branch) {
      return {
        success: false,
        error: 'La sucursal no existe o no pertenece a tu negocio',
      };
    }

    // Leer el archivo Excel
    const arrayBuffer = await file.arrayBuffer();
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Obtener la primera hoja
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return {
        success: false,
        error: 'El archivo Excel no contiene hojas',
      };
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      raw: false,
    }) as any[][];

    if (data.length < 2) {
      return {
        success: false,
        error: 'El archivo Excel debe tener al menos una fila de datos (además del encabezado)',
      };
    }

    // Obtener encabezados (primera fila)
    const headers = data[0].map((h: any) =>
      String(h || '').toLowerCase().trim()
    ) as string[];

    // Mapear nombres de columnas comunes
    const columnMap: Record<string, string> = {
      'nombre': 'nombre',
      'name': 'nombre',
      'producto': 'nombre',
      'product': 'nombre',
      'descripcion': 'descripcion',
      'description': 'descripcion',
      'desc': 'descripcion',
      'marca': 'marca',
      'brand': 'marca',
      'codigo_barras': 'codigo_barras',
      'barcode': 'codigo_barras',
      'codigo': 'codigo_barras',
      'sku': 'sku',
      'costo': 'costo',
      'cost': 'costo',
      'precio': 'precio',
      'price': 'precio',
      'stock': 'stock',
      'inventario': 'stock',
      'inventory': 'stock',
      'bonificacion': 'bonificacion',
      'bonification': 'bonificacion',
      'fecha_vencimiento': 'fecha_vencimiento',
      'expiration': 'fecha_vencimiento',
      'exp': 'fecha_vencimiento',
      'vencimiento': 'fecha_vencimiento',
      'presentaciones': 'presentaciones',
      'presentations': 'presentaciones',
      'variantes': 'presentaciones',
      'variants': 'presentaciones',
    };

    // Crear índice de columnas
    const columnIndex: Record<string, number> = {};
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();
      const mappedColumn = columnMap[normalizedHeader];
      if (mappedColumn) {
        columnIndex[mappedColumn] = index;
      }
    });

    // Validar columnas requeridas
    if (columnIndex['nombre'] === undefined) {
      return {
        success: false,
        error: 'El archivo debe tener una columna "nombre" o "name"',
      };
    }

    if (columnIndex['costo'] === undefined && columnIndex['precio'] === undefined) {
      return {
        success: false,
        error: 'El archivo debe tener columnas "costo" y "precio" (o "cost" y "price")',
      };
    }

    let importedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Procesar cada fila (empezando desde la fila 2, índice 1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Saltar filas vacías
      if (!row || row.every((cell: any) => !cell || String(cell).trim() === '')) {
        continue;
      }

      try {
        // Extraer datos de la fila
        const getValue = (column: string): string | null => {
          const index = columnIndex[column];
          if (index === undefined || index >= row.length) return null;
          const value = row[index];
          return value !== null && value !== undefined ? String(value).trim() : null;
        };

        const nombre = getValue('nombre');
        if (!nombre || nombre === '') {
          errorCount++;
          errors.push(`Fila ${i + 1}: Nombre es requerido`);
          continue;
        }

        const descripcion = getValue('descripcion');
        const marca = getValue('marca');
        const codigoBarras = getValue('codigo_barras');
        const sku = getValue('sku');

        // Parsear números
        const costoStr = getValue('costo') || getValue('precio') || '0';
        const precioStr = getValue('precio') || getValue('costo') || '0';
        const stockStr = getValue('stock') || '0';
        const bonificacionStr = getValue('bonificacion') || '0';

        const costo = parseFloat(String(costoStr).replace(/[^0-9.-]/g, '')) || 0;
        const precio = parseFloat(String(precioStr).replace(/[^0-9.-]/g, '')) || 0;
        const stock = parseFloat(String(stockStr).replace(/[^0-9.-]/g, '')) || 0;
        const bonificacion = parseFloat(String(bonificacionStr).replace(/[^0-9.-]/g, '')) || 0;

        if (costo < 0 || precio < 0) {
          errorCount++;
          errors.push(`Fila ${i + 1} (${nombre}): Costo y precio deben ser números positivos`);
          continue;
        }

        // Parsear fecha de vencimiento
        let fechaVencimiento: string | null = null;
        const fechaStr = getValue('fecha_vencimiento');
        if (fechaStr) {
          try {
            // Intentar parsear diferentes formatos de fecha
            const date = new Date(fechaStr);
            if (!isNaN(date.getTime())) {
              fechaVencimiento = date.toISOString();
            }
          } catch {
            // Si no se puede parsear, se deja como null
          }
        }

        // Parsear presentaciones
        const presentaciones: Array<{ variant: string; units: number; price?: number }> = [];
        const presentacionesStr = getValue('presentaciones');
        if (presentacionesStr) {
          // Formato: "variante:unidades:precio|variante2:unidades2:precio2"
          const presentacionesArray = presentacionesStr.split('|');
          for (const presStr of presentacionesArray) {
            const parts = presStr.split(':').map(p => p.trim());
            if (parts.length >= 2) {
              const variant = parts[0];
              const units = parseInt(parts[1]) || 1;
              const price = parts[2] ? parseFloat(parts[2].replace(/[^0-9.-]/g, '')) : undefined;

              if (variant && units > 0) {
                presentaciones.push({ variant, units, price });
              }
            }
          }
        }

        // Crear el producto y presentaciones en una transacción
        const productId = generateId();
        const now = new Date().toISOString();

        // Preparar presentaciones
        const presentationsData = [
          // Presentación base "unidad"
          {
            id: generateId(),
            product_id: productId,
            variant: 'unidad',
            units: 1,
            price: precio,
            is_active: 1,
            created_at: now,
            updated_at: now,
          },
          // Presentaciones adicionales
          ...presentaciones.map(p => ({
            id: generateId(),
            product_id: productId,
            variant: p.variant,
            units: p.units,
            price: p.price || precio,
            is_active: 1,
            created_at: now,
            updated_at: now,
          })),
        ];

        const presentationOps = presentationsData.map(p => ({
          sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [p.id, p.product_id, p.variant, p.units, p.price, p.is_active, p.created_at, p.updated_at],
        }));

        try {
          await db.transact([
            {
              sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              params: [
                productId,
                actualBranchId,
                nombre,
                descripcion || null,
                fechaVencimiento,
                marca || null,
                codigoBarras || null,
                sku || null,
                costo,
                precio,
                stock,
                bonificacion,
                session.userId,
                1,
                now,
                now,
              ],
            },
            ...presentationOps,
          ]);
        } catch (productError) {
          console.error(`❌ Error creando producto ${nombre}:`, productError);
          errorCount++;
          errors.push(`Fila ${i + 1} (${nombre}): ${productError instanceof Error ? productError.message : 'Error desconocido'}`);
          continue;
        }

        importedCount++;
      } catch (error) {
        console.error(`❌ Error procesando fila ${i + 1}:`, error);
        errorCount++;
        errors.push(`Fila ${i + 1}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }

    console.log(
      `✅ Importación desde Excel completada: ${importedCount} productos importados, ${errorCount} errores`
    );

    return {
      success: true,
      importedCount,
      errorCount,
      totalRows: data.length - 1,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error('❌ Error en importProductsFromExcel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Genera una plantilla Excel para importar productos
 */
export async function generateExcelTemplate() {
  try {
    const XLSX = await import('xlsx');

    // Crear datos de ejemplo
    const data = [
      // Encabezados
      [
        'nombre',
        'descripcion',
        'marca',
        'codigo_barras',
        'sku',
        'costo',
        'precio',
        'stock',
        'bonificacion',
        'fecha_vencimiento',
        'presentaciones',
      ],
      // Fila de ejemplo
      [
        'Producto Ejemplo',
        'Descripción del producto',
        'Marca Ejemplo',
        '1234567890123',
        'SKU-001',
        10.50,
        15.99,
        100,
        0,
        '2025-12-31',
        'pack:6:89.99|caja:12:179.99',
      ],
      // Fila de ejemplo 2
      [
        'Otro Producto',
        '',
        'Otra Marca',
        '',
        'SKU-002',
        5.00,
        8.50,
        50,
        0,
        '',
        '',
      ],
    ];

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 20 }, // nombre
      { wch: 30 }, // descripcion
      { wch: 15 }, // marca
      { wch: 15 }, // codigo_barras
      { wch: 15 }, // sku
      { wch: 12 }, // costo
      { wch: 12 }, // precio
      { wch: 10 }, // stock
      { wch: 12 }, // bonificacion
      { wch: 18 }, // fecha_vencimiento
      { wch: 40 }, // presentaciones
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    // Generar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      success: true,
      buffer: Buffer.from(buffer),
      filename: 'plantilla-importacion-productos.xlsx',
    };
  } catch (error) {
    console.error('❌ Error generando plantilla Excel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Exporta productos a un archivo Excel
 * El formato es el mismo que la plantilla de importación
 */
export async function exportProductsToExcel(branchId?: string) {
  try {
    // Obtener productos usando la función existente
    const productsResult = await getProducts(branchId, { limit: 10000 });

    if (!productsResult.success) {
      return {
        success: false,
        error: productsResult.error || 'Error al obtener productos',
      };
    }

    const products = productsResult.products || [];

    if (products.length === 0) {
      return {
        success: false,
        error: 'No hay productos para exportar',
      };
    }

    const XLSX = await import('xlsx');

    // Crear encabezados (igual que la plantilla)
    const headers = [
      'nombre',
      'descripcion',
      'marca',
      'codigo_barras',
      'sku',
      'costo',
      'precio',
      'stock',
      'bonificacion',
      'fecha_vencimiento',
      'presentaciones',
    ];

    // Preparar datos
    const data: any[][] = [headers];

    // Procesar cada producto
    for (const product of products) {
      // Formatear fecha de vencimiento
      let fechaVencimiento = '';
      if (product.expiration) {
        try {
          const date = new Date(product.expiration);
          if (!isNaN(date.getTime())) {
            // Formato YYYY-MM-DD
            fechaVencimiento = date.toISOString().split('T')[0];
          }
        } catch {
          // Si no se puede parsear, dejar vacío
        }
      }

      // Formatear presentaciones (excluyendo "unidad" que es la base)
      const presentations: string[] = [];
      if (product.product_presentations && Array.isArray(product.product_presentations)) {
        for (const pres of product.product_presentations) {
          // Excluir la presentación "unidad" ya que es la base
          if (pres.variant && pres.variant !== 'unidad' && pres.is_active !== false) {
            const units = pres.units || 1;
            const price = pres.price !== null && pres.price !== undefined ? pres.price : '';
            presentations.push(`${pres.variant}:${units}:${price}`);
          }
        }
      }
      const presentacionesStr = presentations.join('|');

      // Crear fila con los datos del producto
      const row = [
        product.name || '',
        product.description || '',
        product.brand || '',
        product.barcode || '',
        product.sku || '',
        product.cost || 0,
        product.price || 0,
        product.stock || 0,
        product.bonification || 0,
        fechaVencimiento,
        presentacionesStr,
      ];

      data.push(row);
    }

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar ancho de columnas (igual que la plantilla)
    const columnWidths = [
      { wch: 20 }, // nombre
      { wch: 30 }, // descripcion
      { wch: 15 }, // marca
      { wch: 15 }, // codigo_barras
      { wch: 15 }, // sku
      { wch: 12 }, // costo
      { wch: 12 }, // precio
      { wch: 10 }, // stock
      { wch: 12 }, // bonificacion
      { wch: 18 }, // fecha_vencimiento
      { wch: 40 }, // presentaciones
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

    // Generar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Obtener nombre de la sucursal para el nombre del archivo
    let filename = 'reporte-productos.xlsx';
    if (branchId) {
      const db = getDatabaseClient();
      const branch = await db.selectOne<{ name: string }>(
        `SELECT name FROM branches WHERE id = ? LIMIT 1`,
        [branchId]
      );

      if (branch?.name) {
        // Limpiar el nombre de la sucursal para usarlo en el nombre del archivo
        const branchName = branch.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = `reporte-productos-${branchName}.xlsx`;
      }
    }

    // Convertir buffer a base64 para poder serializarlo
    const base64 = Buffer.from(buffer).toString('base64');

    return {
      success: true,
      base64,
      filename,
      productCount: products.length,
    };
  } catch (error) {
    console.error('❌ Error exportando productos a Excel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
