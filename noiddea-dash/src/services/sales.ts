import { getDatabaseClient } from "@/lib/db/client";
import { getServerSession } from "@/lib/session";
import { generateId } from "@/lib/database";
import type { SaleInsert, SaleItemInsert } from "@/types";

export interface CreateSaleInput {
  branchId: string;
  userId: string;
  customer?: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'digital_wallet';
  items: {
    productId: string; // ID del producto base
    productPresentationId: string; // ID de la presentación
    quantity: number; // Cantidad de presentaciones
    unitPrice: number;
    bonification: number;
    presentationUnits: number; // Unidades por presentación
  }[];
}

export interface CreateSaleResult {
  success: boolean;
  saleId?: string;
  error?: string;
  saleData?: {
    id: string;
    saleNumber: string;
    businessName: string;
    taxId: string;
    branchName: string;
    branchLocation: string;
    customer: string | null;
    userName: string;
    date: string;
    paymentMethod: string;
    items: {
      name: string;
      variant: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[];
    total: number;
  };
}

/**
 * Crea una venta y actualiza el stock de los productos
 * Esta función se ejecuta en el servidor para garantizar la integridad de los datos
 */
export async function createSale(input: CreateSaleInput): Promise<CreateSaleResult> {
  const db = getDatabaseClient();

  try {
    // Validar parámetros de entrada
    if (!input.branchId || typeof input.branchId !== 'string' || input.branchId.trim() === '') {
      return {
        success: false,
        error: 'ID de sucursal inválido'
      };
    }

    if (!input.userId || typeof input.userId !== 'string' || input.userId.trim() === '') {
      return {
        success: false,
        error: 'ID de usuario inválido'
      };
    }

    if (!input.paymentMethod || !['cash', 'card', 'transfer', 'digital_wallet'].includes(input.paymentMethod)) {
      return {
        success: false,
        error: 'Método de pago inválido'
      };
    }

    // Validar que haya items
    if (!input.items || input.items.length === 0) {
      return {
        success: false,
        error: 'No hay productos en el carrito'
      };
    }

    // Validar que todos los items tengan una presentación válida
    for (const item of input.items) {
      if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') {
        return {
          success: false,
          error: 'ID de producto inválido en el carrito'
        };
      }
      if (!item.productPresentationId || typeof item.productPresentationId !== 'string' || item.productPresentationId.trim() === '') {
        return {
          success: false,
          error: 'Todos los productos deben tener una presentación seleccionada'
        };
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return {
          success: false,
          error: 'La cantidad debe ser un número mayor a cero'
        };
      }
      if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
        return {
          success: false,
          error: 'El precio unitario debe ser un número válido'
        };
      }
    }

    // Calcular el total de la venta
    // El unitPrice es el precio por presentación, y quantity es la cantidad de presentaciones
    const total = input.items.reduce((sum, item) => {
      const unitPrice = Number(item.unitPrice) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (unitPrice * quantity);
    }, 0);

    // 0. Validar que user_id existe
    const userExists = await db.selectOne<{ id: string }>(
      `SELECT id FROM users WHERE id = ? LIMIT 1`,
      [input.userId]
    );

    if (!userExists) {
      return {
        success: false,
        error: 'El usuario especificado no existe'
      };
    }

    // 0.1. Obtener el business_id del usuario para validar el branch
    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [input.userId]
    );

    let businessId: string | null = null;
    if (businessUser) {
      businessId = businessUser.business_id;
    } else {
      // Si no es owner, buscar a través de branches_users
      const branchUser = await db.selectOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [input.userId]
      );
      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    if (!businessId) {
      return {
        success: false,
        error: 'No se pudo identificar el negocio del usuario'
      };
    }

    // 0.2. Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      // Buscar la primera sucursal del negocio
      const firstBranch = await db.selectOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessId]
      );
      
      if (firstBranch) {
        return firstBranch.id;
      }
      
      // Si no hay sucursales, crear una por defecto
      const defaultBranchId = generateId();
      const business = await db.selectOne<{ name: string; description: string | null }>(
        `SELECT name, description FROM businesses WHERE id = ? LIMIT 1`,
        [businessId]
      );
      const branchName = business?.name || 'Sucursal Principal';
      const branchLocation = business?.description || business?.name || 'Sucursal Principal';
      const now = new Date().toISOString();
      
      await db.mutate(
        `INSERT INTO branches (id, business_id, name, location, phone, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [defaultBranchId, businessId, branchName, branchLocation, null, now]
      );
      
      return defaultBranchId;
    };

    // 0.3. Validar y obtener branch_id real
    let actualBranchId: string = input.branchId;
    
    // Si branchId es igual a businessId, es un business convertido a branch
    if (actualBranchId === businessId) {
      actualBranchId = await getOrCreateDefaultBranch();
    } else {
      // Validar que la sucursal existe y pertenece al negocio
      const branch = await db.selectOne<{ id: string; business_id: string }>(
        `SELECT id, business_id FROM branches WHERE id = ? AND business_id = ? LIMIT 1`,
        [actualBranchId, businessId]
      );

      if (!branch) {
        // Si no existe, intentar obtener o crear una por defecto
        actualBranchId = await getOrCreateDefaultBranch();
      }
    }

    // Actualizar el branchId en el input para usar el ID real de la sucursal
    input.branchId = actualBranchId;

    // 1. Verificar stock disponible para todos los productos en una sola query
    const productIds = [...new Set(input.items.map(item => item.productId))];
    const placeholders = productIds.map(() => '?').join(',');
    const products = await db.select<{
      id: string;
      stock: number | null;
      name: string;
      bonification: number | null;
    }>(
      `SELECT id, stock, name, bonification FROM products WHERE id IN (${placeholders})`,
      productIds
    );

    if (!products || products.length === 0) {
      return {
        success: false,
        error: 'No se pudieron verificar los productos'
      };
    }

    // Crear un mapa para acceso rápido
    const productsMap = new Map(products.map(p => [p.id, p]));

    // Verificar stock para cada item
    for (const item of input.items) {
      const product = productsMap.get(item.productId);
      if (!product) {
        return {
          success: false,
          error: `Producto no encontrado`
        };
      }

      const requiredStock = item.quantity * item.presentationUnits;
      const currentStock = product.stock ?? 0;

      if (currentStock < requiredStock) {
        return {
          success: false,
          error: `Stock insuficiente para ${product.name}. Disponible: ${currentStock}, Requerido: ${requiredStock}`
        };
      }
    }

    // 2. Verificar que todas las presentaciones existen y pertenecen a los productos correctos
    const presentationIds = input.items.map(item => item.productPresentationId);
    const presentationPlaceholders = presentationIds.map(() => '?').join(',');
    const presentations = await db.select<{ id: string; product_id: string }>(
      `SELECT id, product_id FROM product_presentations WHERE id IN (${presentationPlaceholders})`,
      presentationIds
    );

    if (!presentations || presentations.length !== presentationIds.length) {
      return {
        success: false,
        error: 'Alguna presentación del producto no existe. Por favor, recarga la página.'
      };
    }

    // Verificar que cada presentación pertenece al producto correcto
    const presentationsMap = new Map(presentations.map(p => [p.id, p.product_id]));
    for (const item of input.items) {
      const presentation = presentationsMap.get(item.productPresentationId);
      if (!presentation) {
        return {
          success: false,
          error: 'Alguna presentación del producto no existe. Por favor, recarga la página.'
        };
      }
      if (presentation !== item.productId) {
        return {
          success: false,
          error: `La presentación no pertenece al producto especificado. Producto: ${item.productId}, Presentación: ${item.productPresentationId}`
        };
      }
    }

    // 3. Generar IDs
    const saleId = generateId();
    const saleItemIds = input.items.map(() => generateId());

    // 4. Calcular stock y beneficios antes de crear la venta
    let totalBenefit = 0;
    const stockUpdates = new Map<string, { stock: number; bonification: number }>();
    
    // Calcular todos los cambios de stock primero
    for (const item of input.items) {
      const product = productsMap.get(item.productId);
      if (!product) continue;
      
      const stockToDecrease = item.quantity * item.presentationUnits;
      const currentStock = product.stock ?? 0;
      const newStock = Math.max(0, currentStock - stockToDecrease);
      const bonification = product.bonification ?? 0;
      const unitsQuantity = item.quantity * item.presentationUnits;
      
      // Acumular beneficio
      totalBenefit += bonification * unitsQuantity;
      
      // Acumular actualizaciones de stock
      if (stockUpdates.has(item.productId)) {
        const existing = stockUpdates.get(item.productId)!;
        stockUpdates.set(item.productId, {
          stock: Math.max(0, existing.stock - stockToDecrease),
          bonification: existing.bonification
        });
      } else {
        stockUpdates.set(item.productId, {
          stock: newStock,
          bonification
        });
      }
    }

    // 5. Crear la venta y items en una transacción
    const now = new Date().toISOString();
    const saleItems: Array<{ sql: string; params: any[] }> = input.items.map((item, idx) => ({
      sql: `INSERT INTO sale_items (id, sale_id, product_presentation_id, quantity, unit_price, bonification, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      params: [
        saleItemIds[idx],
        saleId,
        item.productPresentationId,
        item.quantity,
        item.unitPrice,
        item.bonification || 0,
        item.quantity * item.unitPrice,
      ],
    }));

    // Preparar actualizaciones de stock
    const stockUpdateOps: Array<{ sql: string; params: any[] }> = Array.from(stockUpdates.entries()).map(([productId, { stock }]) => ({
      sql: `UPDATE products SET stock = ? WHERE id = ?`,
      params: [stock, productId],
    }));

    // Validar que todos los parámetros están definidos
    const allQueries = [
      // Crear la venta
      {
        sql: `INSERT INTO sales (id, branch_id, user_id, customer, payment_method, status, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          saleId,
          input.branchId,
          input.userId,
          input.customer || null,
          input.paymentMethod,
          'completed',
          total,
          now,
        ],
      },
      // Crear los items de la venta
      ...saleItems,
      // Actualizar stock de productos
      ...stockUpdateOps,
    ];

    // Validar que no hay parámetros undefined o null problemáticos
    for (const query of allQueries) {
      if (!query.sql || !Array.isArray(query.params)) {
        return {
          success: false,
          error: 'Error en la preparación de la transacción: parámetros inválidos'
        };
      }
    }

    // Ejecutar todo en una transacción
    try {
      await db.transact(allQueries);
    } catch (transactionError: any) {
      const errorMessage = transactionError?.message || String(transactionError);
      
      // Si es un error de clave foránea, proporcionar un mensaje más específico
      if (errorMessage.includes('FOREIGN KEY constraint failed')) {
        return {
          success: false,
          error: 'Error de integridad de datos: Una de las referencias (sucursal, usuario o presentación de producto) no existe. Por favor, recarga la página e intenta nuevamente.'
        };
      }
      
      throw transactionError;
    }

    // 6. Actualizar el beneficio acumulado del usuario
    const branchUser = await db.selectOne<{ id: string; benefit: number | null }>(
      `SELECT id, benefit FROM branches_users WHERE user_id = ? AND branch_id = ? AND is_active = 1 LIMIT 1`,
      [input.userId, input.branchId]
    );

    if (branchUser) {
      const newBenefit = (branchUser.benefit ?? 0) + totalBenefit;
      await db.mutate(
        `UPDATE branches_users SET benefit = ? WHERE id = ?`,
        [newBenefit, branchUser.id]
      );
    }

    // 7. Actualizar la sesión activa con los datos de la venta (no crítico, no bloquear)
    try {
      const { updateSessionOnSale } = await import('./sessions');
      await updateSessionOnSale(
        input.userId,
        input.branchId,
        total,
        totalBenefit,
        input.paymentMethod
      );
    } catch (sessionError) {
      console.error('Error al actualizar sesión:', sessionError);
      // No fallar la venta por error al actualizar sesión
    }

    // 8. Obtener datos completos de la venta para la boleta
    const saleWithDetails = await db.selectOne<{
      id: string;
      created_at: string;
      customer: string | null;
      payment_method: string;
      total: number;
      branch_id: string;
      user_id: string;
    }>(
      `SELECT id, created_at, customer, payment_method, total, branch_id, user_id FROM sales WHERE id = ? LIMIT 1`,
      [saleId]
    );

    const branchData = await db.selectOne<{
      id: string;
      name: string;
      location: string;
      business_id: string;
      business_name: string;
      business_tax_id: string;
      business_location: string | null;
    }>(
      `SELECT 
        b.id,
        b.name,
        b.location,
        b.business_id,
        biz.name as business_name,
        biz.tax_id as business_tax_id,
        biz.location as business_location
       FROM branches b
       INNER JOIN businesses biz ON biz.id = b.business_id
       WHERE b.id = ? LIMIT 1`,
      [input.branchId]
    );

    const userData = await db.selectOne<{ id: string; name: string }>(
      `SELECT id, name FROM users WHERE id = ? LIMIT 1`,
      [input.userId]
    );

    // Obtener items de la venta con sus detalles
    const saleItemsData = await db.select<{
      quantity: number;
      unit_price: number;
      subtotal: number | null;
      product_presentation_id: string;
      variant: string;
      product_name: string;
    }>(
      `SELECT 
        si.quantity,
        si.unit_price,
        si.subtotal,
        si.product_presentation_id,
        pp.variant,
        p.name as product_name
       FROM sale_items si
       INNER JOIN product_presentations pp ON pp.id = si.product_presentation_id
       INNER JOIN products p ON p.id = pp.product_id
       WHERE si.sale_id = ?`,
      [saleId]
    );

    let saleData = undefined;
    if (saleWithDetails && branchData && userData) {
      // Generar número de boleta (usar los últimos 8 caracteres del ID)
      const saleNumber = saleId.slice(-8).toUpperCase();

      saleData = {
        id: saleId,
        saleNumber,
        businessName: branchData.business_name || 'Empresa',
        taxId: branchData.business_tax_id || '',
        businessLocation: branchData.business_location || null,
        branchName: branchData.name || '',
        branchLocation: branchData.location || '',
        customer: saleWithDetails.customer,
        userName: userData.name || '',
        date: saleWithDetails.created_at || now,
        paymentMethod: saleWithDetails.payment_method,
        items: saleItemsData.map((item) => ({
          name: item.product_name || '',
          variant: item.variant || '',
          quantity: item.quantity,
          unitPrice: item.unit_price,
          subtotal: item.subtotal || item.quantity * item.unit_price,
        })),
        total: saleWithDetails.total,
      };
    }

    return {
      success: true,
      saleId,
      saleData
    };
  } catch (error) {
    console.error('Error inesperado al crear venta:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'string' 
        ? error 
        : 'Ocurrió un error inesperado al procesar la venta';
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Obtiene las ventas de una sucursal en un rango de fechas
 */
export async function getSalesByBranch(
  branchId: string,
  dateFrom?: Date,
  dateTo?: Date
) {
  try {
    const db = getDatabaseClient();

    let sql = `SELECT * FROM sales WHERE branch_id = ?`;
    const params: any[] = [branchId];

    if (dateFrom) {
      sql += ` AND created_at >= ?`;
      params.push(dateFrom.toISOString());
    }

    if (dateTo) {
      sql += ` AND created_at <= ?`;
      params.push(dateTo.toISOString());
    }

    sql += ` ORDER BY created_at DESC`;

    const sales = await db.select<any>(sql, params);

    // Para cada venta, obtener sus items
    const salesWithItems = await Promise.all(
      sales.map(async (sale) => {
        const items = await db.select<{
          id: string;
          product_presentation_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number | null;
          variant: string;
          product_name: string;
        }>(
          `SELECT 
            si.id,
            si.product_presentation_id,
            si.quantity,
            si.unit_price,
            si.subtotal,
            pp.variant,
            p.name as product_name
           FROM sale_items si
           INNER JOIN product_presentations pp ON pp.id = si.product_presentation_id
           INNER JOIN products p ON p.id = pp.product_id
           WHERE si.sale_id = ?`,
          [sale.id]
        );

        return {
          ...sale,
          sale_items: items.map(item => ({
            ...item,
            product_presentation: {
              id: item.product_presentation_id,
              variant: item.variant,
              product: {
                name: item.product_name,
              },
            },
          })),
        };
      })
    );

    return { success: true, sales: salesWithItems, error: null };
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return {
      success: false,
      sales: [],
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene una venta específica con todos sus detalles
 */
export async function getSaleById(saleId: string) {
  try {
    const db = getDatabaseClient();

    const sale = await db.selectOne<any>(
      `SELECT * FROM sales WHERE id = ? LIMIT 1`,
      [saleId]
    );

    if (!sale) {
      return { success: false, data: null, error: 'Venta no encontrada' };
    }

    // Obtener branch y user
    const [branch, user, items] = await Promise.all([
      db.selectOne<any>(
        `SELECT * FROM branches WHERE id = ? LIMIT 1`,
        [sale.branch_id]
      ),
      db.selectOne<any>(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [sale.user_id]
      ),
      db.select<any>(
        `SELECT 
          si.*,
          pp.variant,
          pp.product_id,
          p.name as product_name
         FROM sale_items si
         INNER JOIN product_presentations pp ON pp.id = si.product_presentation_id
         INNER JOIN products p ON p.id = pp.product_id
         WHERE si.sale_id = ?`,
        [saleId]
      ),
    ]);

    const saleData = {
      ...sale,
      branch: branch || null,
      user: user || null,
      sale_items: items.map((item: any) => ({
        ...item,
        product_presentation: {
          id: item.product_presentation_id,
          variant: item.variant,
          product_id: item.product_id,
          product: {
            id: item.product_id,
            name: item.product_name,
          },
        },
      })),
    };

    return { success: true, data: saleData, error: null };
  } catch (error) {
    console.error('Error al obtener venta:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

