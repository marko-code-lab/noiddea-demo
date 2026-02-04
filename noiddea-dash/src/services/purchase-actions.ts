import { getServerSession, type SessionUser } from '@/lib/session';
import { getDatabaseClient, DatabaseClient } from '@/lib/db/client';
import { generateId } from '@/lib/database';

/**
 * Obtiene todas las compras de un negocio
 */
export async function getPurchases(businessId: string) {
  const db = getDatabaseClient();

  try {
    const purchases = await db.select<any>(
      `SELECT * FROM purchases WHERE business_id = ? ORDER BY created_at DESC`,
      [businessId]
    );

    // Enriquecer con datos relacionados
    const enrichedPurchases = await Promise.all(
      purchases.map(async (purchase) => {
        const [supplier, branch, createdByUser, approvedByUser] = await Promise.all([
          purchase.supplier_id
            ? db.selectOne<any>(`SELECT * FROM suppliers WHERE id = ? LIMIT 1`, [purchase.supplier_id])
            : null,
          purchase.branch_id
            ? db.selectOne<any>(`SELECT * FROM branches WHERE id = ? LIMIT 1`, [purchase.branch_id])
            : null,
          purchase.created_by
            ? db.selectOne<{ id: string; name: string; email: string }>(
                `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
                [purchase.created_by]
              )
            : null,
          purchase.approved_by
            ? db.selectOne<{ id: string; name: string; email: string }>(
                `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
                [purchase.approved_by]
              )
            : null,
        ]);

        return {
          ...purchase,
          supplier: supplier || null,
          branch: branch || null,
          created_by_user: createdByUser || null,
          approved_by_user: approvedByUser || null,
        };
      })
    );

    return { success: true, data: enrichedPurchases };
  } catch (error) {
    console.error('Error in getPurchases:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene las compras de una sucursal específica
 */
export async function getBranchPurchases(branchId: string) {
  const db = getDatabaseClient();

  try {
    const purchases = await db.select<any>(
      `SELECT * FROM purchases WHERE branch_id = ? ORDER BY created_at DESC`,
      [branchId]
    );

    // Enriquecer con datos relacionados
    const enrichedPurchases = await Promise.all(
      purchases.map(async (purchase) => {
        const [supplier, createdByUser, approvedByUser] = await Promise.all([
          purchase.supplier_id
            ? db.selectOne<any>(`SELECT * FROM suppliers WHERE id = ? LIMIT 1`, [purchase.supplier_id])
            : null,
          purchase.created_by
            ? db.selectOne<{ id: string; name: string; email: string }>(
                `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
                [purchase.created_by]
              )
            : null,
          purchase.approved_by
            ? db.selectOne<{ id: string; name: string; email: string }>(
                `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
                [purchase.approved_by]
              )
            : null,
        ]);

        return {
          ...purchase,
          supplier: supplier || null,
          created_by_user: createdByUser || null,
          approved_by_user: approvedByUser || null,
        };
      })
    );

    return { success: true, data: enrichedPurchases };
  } catch (error) {
    console.error('Error in getBranchPurchases:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene una compra por ID con sus items
 */
export async function getPurchaseById(purchaseId: string) {
  const db = getDatabaseClient();

  try {
    const purchase = await db.selectOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    if (!purchase) {
      return { success: false, error: 'Compra no encontrada' };
    }

    // Obtener datos relacionados
    const [supplier, branch, createdByUser, approvedByUser, items] = await Promise.all([
      purchase.supplier_id
        ? db.selectOne<any>(`SELECT * FROM suppliers WHERE id = ? LIMIT 1`, [purchase.supplier_id])
        : null,
      purchase.branch_id
        ? db.selectOne<any>(`SELECT * FROM branches WHERE id = ? LIMIT 1`, [purchase.branch_id])
        : null,
      purchase.created_by
        ? db.selectOne<{ id: string; name: string; email: string }>(
            `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
            [purchase.created_by]
          )
        : null,
      purchase.approved_by
        ? db.selectOne<{ id: string; name: string; email: string }>(
            `SELECT id, name, email FROM users WHERE id = ? LIMIT 1`,
            [purchase.approved_by]
          )
        : null,
      db.select<any>(
        `SELECT * FROM purchase_items WHERE purchase_id = ?`,
        [purchaseId]
      ),
    ]);

    // Enriquecer items con presentaciones y productos
    const enrichedItems = await Promise.all(
      (items || []).map(async (item) => {
        const presentation = await db.selectOne<any>(
          `SELECT * FROM product_presentations WHERE id = ? LIMIT 1`,
          [item.product_presentation_id]
        );

        if (!presentation) {
          return { ...item, product_presentation: null };
        }

        const product = await db.selectOne<any>(
          `SELECT * FROM products WHERE id = ? LIMIT 1`,
          [presentation.product_id]
        );

        return {
          ...item,
          product_presentation: {
            ...presentation,
            product: product || null,
          },
        };
      })
    );

    return {
      success: true,
      data: {
        ...purchase,
        supplier: supplier || null,
        branch: branch || null,
        created_by_user: createdByUser || null,
        approved_by_user: approvedByUser || null,
        purchase_items: enrichedItems,
      },
    };
  } catch (error) {
    console.error('Error in getPurchaseById:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Busca o crea un proveedor por nombre y RUC
 */
async function findOrCreateSupplier(
  db: DatabaseClient,
  businessId: string,
  name: string,
  taxId?: string
): Promise<string> {
  // Buscar proveedor existente por nombre o RUC
  let supplier = null;
  
  if (taxId) {
    // Buscar por RUC
    supplier = await db.selectOne<any>(
      `SELECT id FROM suppliers WHERE business_id = ? AND (name = ? OR ruc = ?) AND is_active = 1 LIMIT 1`,
      [businessId, name.trim(), taxId.trim()]
    );
  } else {
    supplier = await db.selectOne<any>(
      `SELECT id FROM suppliers WHERE business_id = ? AND name = ? AND is_active = 1 LIMIT 1`,
      [businessId, name.trim()]
    );
  }

  if (supplier) {
    return supplier.id;
  }

  // Crear nuevo proveedor
  const supplierId = generateId();
  const now = new Date().toISOString();
  
  await db.mutate(
    `INSERT INTO suppliers (id, business_id, name, phone, ruc, address, is_active, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      supplierId,
      businessId,
      name.trim(),
      '', // Phone vacío por defecto
      taxId?.trim() || null, // RUC
      null, // Address
      1, // is_active
      now,
    ]
  );

  return supplierId;
}

/**
 * Busca o crea un producto y retorna su presentación "unidad"
 * @param createIfNotExists - Si es false, solo busca productos existentes y retorna null si no existe
 */
async function findOrCreateProduct(
  db: DatabaseClient,
  session: SessionUser,
  businessId: string,
  branchId: string,
  productData: {
    name: string;
    brand?: string;
    cost: number;
    price: number;
    expiration?: string;
    barcode?: string;
  },
  createIfNotExists: boolean = true
): Promise<string | null> {
  const { name, brand, cost, price, expiration, barcode } = productData;

  // Buscar producto existente por nombre o barcode
  let product = null;
  
  if (barcode) {
    product = await db.selectOne<any>(
      `SELECT id FROM products WHERE branch_id = ? AND (name = ? OR barcode = ?) AND is_active = 1 LIMIT 1`,
      [branchId, name.trim(), barcode.trim()]
    );
  } else {
    product = await db.selectOne<any>(
      `SELECT id FROM products WHERE branch_id = ? AND name = ? AND is_active = 1 LIMIT 1`,
      [branchId, name.trim()]
    );
  }

  let productId: string;
  let presentationId: string;
  const now = new Date().toISOString();

  if (product) {
    // Producto existe - actualizar costo, precio y expiración
    productId = product.id;
    
    const updateFields: string[] = [];
    const updateParams: any[] = [];
    
    updateFields.push('cost = ?');
    updateParams.push(cost);
    
    updateFields.push('price = ?');
    updateParams.push(price);
    
    if (expiration) {
      updateFields.push('expiration = ?');
      updateParams.push(expiration);
    }
    
    updateParams.push(productId);
    
    await db.mutate(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );
    
    // Actualizar también la presentación "unidad"
    await db.mutate(
      `UPDATE product_presentations SET price = ? WHERE product_id = ? AND variant = 'unidad'`,
      [price, productId]
    );
    
    // Obtener la presentación "unidad"
    const presentation = await db.selectOne<{ id: string }>(
      `SELECT id FROM product_presentations WHERE product_id = ? AND variant = 'unidad' AND is_active = 1 LIMIT 1`,
      [productId]
    );
    
    if (!presentation) {
      // Si no existe la presentación "unidad", crearla
      presentationId = generateId();
      await db.mutate(
        `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [presentationId, productId, 'unidad', 1, price, 1, now]
      );
    } else {
      presentationId = presentation.id;
    }
  } else {
    // Producto no existe
    if (!createIfNotExists) {
      // Si no se debe crear, retornar null
      return null;
    }
    
    // Crear nuevo con información básica
    productId = generateId();
    presentationId = generateId();
    
    // Crear producto solo con presentación "unidad" (sin presentaciones adicionales)
    await db.transact([
      {
        sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          productId,
          branchId,
          name.trim(),
          null, // description
          expiration || null,
          brand?.trim() || null,
          barcode?.trim() || null,
          null, // sku
          cost,
          price,
          0, // stock inicial 0
          0, // bonification
          session.userId,
          1, // is_active
          now,
        ],
      },
      {
        sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params: [presentationId, productId, 'unidad', 1, price, 1, now],
      },
    ]);
  }

  return presentationId;
}

/**
 * Crea una nueva compra con sus items
 * Si el producto no existe, lo crea con información básica sin presentaciones adicionales
 * Si el producto existe, actualiza costo, precio de venta y expiración
 */
export async function createPurchase(
  purchase: {
    business_id: string;
    branch_id?: string;
    supplier_id?: string;
    supplier_name?: string;
    supplier_tax_id?: string;
    status?: string;
    notes?: string | null;
    type?: string;
    items: Array<{
      product_name: string;
      product_brand?: string;
      product_barcode?: string;
      quantity: number;
      unit_cost: number;
      sale_price: number;
      expiration?: string;
    }>;
  }
) {
  const db = getDatabaseClient();

  try {
    // Validar autenticación
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener business_id del usuario
    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (!businessUser) {
      return { success: false, error: 'No tienes un negocio asociado' };
    }

    const businessId = businessUser.business_id;
    const branchId = purchase.branch_id || businessId; // Usar business_id si no hay branch_id

    // Buscar o crear proveedor
    let supplierId: string;
    if (purchase.supplier_id) {
      supplierId = purchase.supplier_id;
    } else if (purchase.supplier_name) {
      supplierId = await findOrCreateSupplier(
        db,
        businessId,
        purchase.supplier_name,
        purchase.supplier_tax_id
      );
    } else {
      return { success: false, error: 'Debe proporcionar un proveedor' };
    }

    // Procesar items: buscar/crear productos y obtener sus presentaciones
    const purchaseItemsOps: Array<{ sql: string; params: any[] }> = [];
    const productUpdateOps: Array<{ sql: string; params: any[] }> = [];
    let total = 0;
    const now = new Date().toISOString();
    const purchaseId = generateId();
    const purchaseStatus = purchase.status || 'pending';
    const isReceived = purchaseStatus === 'received';

    // Guardar información de items para actualizar stock si es necesario
    const itemsForStockUpdate: Array<{ presentationId: string; quantity: number }> = [];

    for (const item of purchase.items) {
      // Para pedidos programados, solo buscar productos existentes (no crear nuevos)
      // Para pedidos recibidos inmediatamente, buscar o crear productos
      const presentationId = await findOrCreateProduct(
        db,
        session,
        businessId,
        branchId,
        {
          name: item.product_name,
          brand: item.product_brand,
          cost: item.unit_cost,
          price: item.sale_price,
          expiration: item.expiration,
          barcode: item.product_barcode,
        },
        isReceived // Solo crear productos nuevos si el pedido es recibido inmediatamente
      );

      // Si el producto no existe y es un pedido programado, crear el producto como INACTIVO
      // (necesitamos el presentation_id para purchase_items, pero el producto no aparecerá en inventario hasta recibirse)
      let finalPresentationId = presentationId;
      if (!presentationId && !isReceived) {
        // Crear producto INACTIVO para pedidos programados (no aparecerá en inventario hasta recibirse)
        const tempProductId = generateId();
        const tempPresentationId = generateId();
        
        await db.transact([
          {
            sql: `INSERT INTO products (id, branch_id, name, description, expiration, brand, barcode, sku, cost, price, stock, bonification, created_by_user_id, is_active, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              tempProductId,
              branchId,
              item.product_name.trim(),
              null, // description
              item.expiration || null,
              item.product_brand?.trim() || null,
              item.product_barcode?.trim() || null,
              null, // sku
              item.unit_cost,
              item.sale_price,
              0, // stock inicial 0 (solo se actualizará cuando se reciba el pedido)
              0, // bonification
              session.userId,
              0, // is_active = 0 (INACTIVO - no aparecerá en inventario hasta recibirse)
              now,
            ],
          },
          {
            sql: `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            params: [tempPresentationId, tempProductId, 'unidad', 1, item.sale_price, 0, now], // is_active = 0
          },
        ]);
        
        finalPresentationId = tempPresentationId;
      }

      if (!finalPresentationId) {
        throw new Error(`No se pudo encontrar o crear el producto: ${item.product_name}`);
      }

      const subtotal = item.quantity * item.unit_cost;
      total += subtotal;

      purchaseItemsOps.push({
        sql: `INSERT INTO purchase_items (id, purchase_id, product_presentation_id, quantity, unit_cost, subtotal) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        params: [
          generateId(),
          purchaseId,
          finalPresentationId,
          item.quantity,
          item.unit_cost,
          subtotal,
        ],
      });

      // Guardar para actualizar stock si el pedido es recibido inmediatamente
      if (isReceived && finalPresentationId) {
        itemsForStockUpdate.push({ presentationId: finalPresentationId, quantity: item.quantity });
      }
    }

    // Si el pedido es recibido inmediatamente, preparar actualizaciones de stock
    if (isReceived && itemsForStockUpdate.length > 0) {
      for (const item of itemsForStockUpdate) {
        try {
          // Obtener el producto asociado a la presentación
          const presentation = await db.selectOne<{ product_id: string }>(
            `SELECT product_id FROM product_presentations WHERE id = ? LIMIT 1`,
            [item.presentationId]
          );

          if (!presentation) {
            console.error(`[createPurchase] No se encontró la presentación para el item con presentationId ${item.presentationId}`);
            continue;
          }

          // Obtener el stock actual del producto
          const product = await db.selectOne<{ stock: number | null }>(
            `SELECT stock FROM products WHERE id = ? LIMIT 1`,
            [presentation.product_id]
          );

          if (!product) {
            console.error(`[createPurchase] No se encontró el producto con ID ${presentation.product_id}`);
            continue;
          }

          const newStock = (product.stock || 0) + item.quantity;
          productUpdateOps.push({
            sql: `UPDATE products SET stock = ? WHERE id = ?`,
            params: [newStock, presentation.product_id],
          });
        } catch (itemError) {
          console.error(`[createPurchase] Error procesando item para stock update:`, itemError);
        }
      }
    }

    // Crear la compra y items en una transacción (incluir actualizaciones de stock si es recibido)
    const transactionOps = [
      {
        sql: `INSERT INTO purchases (id, business_id, branch_id, supplier_id, type, status, total, notes, created_by, created_at${isReceived ? ', received_at' : ''}) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?${isReceived ? ', ?' : ''})`,
        params: [
          purchaseId,
          businessId,
          branchId || null,
          supplierId,
          purchase.type || 'purchase', // type por defecto
          purchaseStatus,
          total,
          purchase.notes || null,
          session.userId,
          now,
          ...(isReceived ? [now] : []),
        ],
      },
      ...purchaseItemsOps,
      ...productUpdateOps,
    ];

    await db.transact(transactionOps);

    // Obtener la compra creada
    const purchaseData = await db.selectOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true, data: purchaseData };
  } catch (error) {
    console.error('Error in createPurchase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza el estado de una compra
 */
export async function updatePurchaseStatus(
  purchaseId: string,
  status: string,
  notes?: string
) {
  const db = getDatabaseClient();

  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'No autenticado' };
    }

    const now = new Date().toISOString();
    const updateFields: string[] = ['status = ?'];
    const updateParams: any[] = [status];

    // Si se aprueba, registrar quién aprobó y cuándo
    if (status === 'approved') {
      updateFields.push('approved_by = ?', 'approved_at = ?');
      updateParams.push(session.userId, now);
    }

    // Si se marca como recibida, registrar cuándo
    if (status === 'received') {
      updateFields.push('received_at = ?');
      updateParams.push(now);
    }

    // Agregar notas si se proporcionan
    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateParams.push(notes);
    }

    updateParams.push(purchaseId);

    await db.mutate(
      `UPDATE purchases SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    const updatedPurchase = await db.selectOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true, data: updatedPurchase };
  } catch (error) {
    console.error('Error in updatePurchaseStatus:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Aprueba una compra
 */
export async function approvePurchase(purchaseId: string) {
  return updatePurchaseStatus(purchaseId, 'approved');
}

/**
 * Marca una compra como recibida y actualiza el inventario
 */
export async function receivePurchase(purchaseId: string) {
  const db = getDatabaseClient();

  try {
    // Obtener la compra con sus items
    const purchase = await db.selectOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    if (!purchase) {
      return { success: false, error: 'Compra no encontrada' };
    }

    if (!purchase.branch_id) {
      return { success: false, error: 'La compra no tiene sucursal asignada' };
    }

    const items = await db.select<any>(
      `SELECT * FROM purchase_items WHERE purchase_id = ?`,
      [purchaseId]
    );

    if (!items || items.length === 0) {
      return { success: false, error: 'El pedido no tiene items' };
    }

    // Actualizar el stock del producto y activar productos inactivos
    const stockUpdateOps: Array<{ sql: string; params: any[] }> = [];
    const errors: string[] = [];
    
    for (const item of items) {
      try {
        // Obtener el producto asociado a la presentación
        const presentation = await db.selectOne<{ product_id: string }>(
          `SELECT product_id FROM product_presentations WHERE id = ? LIMIT 1`,
          [item.product_presentation_id]
        );

        if (!presentation) {
          errors.push(`No se encontró la presentación para el item con ID ${item.id}`);
          continue;
        }

        // Obtener el stock actual y estado del producto
        const product = await db.selectOne<{ stock: number | null; is_active: number }>(
          `SELECT stock, is_active FROM products WHERE id = ? LIMIT 1`,
          [presentation.product_id]
        );

        if (!product) {
          errors.push(`No se encontró el producto con ID ${presentation.product_id}`);
          continue;
        }

        const newStock = (product.stock || 0) + item.quantity;
        
        // Si el producto está inactivo, activarlo y actualizar stock
        // Si está activo, solo actualizar stock
        if (product.is_active === 0) {
          // Activar el producto y actualizar stock
          stockUpdateOps.push({
            sql: `UPDATE products SET stock = ?, is_active = 1 WHERE id = ?`,
            params: [newStock, presentation.product_id],
          });
          
          // También activar la presentación
          stockUpdateOps.push({
            sql: `UPDATE product_presentations SET is_active = 1 WHERE id = ?`,
            params: [item.product_presentation_id],
          });
        } else {
          // Solo actualizar stock
          stockUpdateOps.push({
            sql: `UPDATE products SET stock = ? WHERE id = ?`,
            params: [newStock, presentation.product_id],
          });
        }
      } catch (itemError) {
        console.error(`[receivePurchase] Error procesando item ${item.id}:`, itemError);
        errors.push(`Error procesando item: ${itemError instanceof Error ? itemError.message : 'Error desconocido'}`);
      }
    }

    if (stockUpdateOps.length === 0) {
      return { 
        success: false, 
        error: `No se pudo actualizar ningún producto. Errores: ${errors.join('; ')}` 
      };
    }

    // Ejecutar actualización de stock y marca como recibida en una transacción
    const now = new Date().toISOString();
    try {
      await db.transact([
        ...stockUpdateOps,
        {
          sql: `UPDATE purchases SET status = ?, received_at = ? WHERE id = ?`,
          params: ['received', now, purchaseId],
        },
      ]);
    } catch (transactionError) {
      console.error('[receivePurchase] Error en transacción:', transactionError);
      return {
        success: false,
        error: `Error al ejecutar la transacción: ${transactionError instanceof Error ? transactionError.message : 'Error desconocido'}`,
      };
    }

    // Obtener la compra actualizada
    const updatedPurchase = await db.selectOne<any>(
      `SELECT * FROM purchases WHERE id = ? LIMIT 1`,
      [purchaseId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true, data: updatedPurchase };
  } catch (error) {
    console.error('Error in receivePurchase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Cancela una compra
 */
export async function cancelPurchase(purchaseId: string, reason?: string) {
  return updatePurchaseStatus(purchaseId, 'cancelled', reason);
}

/**
 * Obtiene estadísticas de compras
 */
export async function getPurchaseStats(businessId: string) {
  const db = getDatabaseClient();

  try {
    const purchases = await db.select<{ status: string; total: number | null }>(
      `SELECT status, total FROM purchases WHERE business_id = ?`,
      [businessId]
    );

    const stats = {
      total: purchases?.length || 0,
      pending: purchases?.filter(p => p.status === 'pending').length || 0,
      approved: purchases?.filter(p => p.status === 'approved').length || 0,
      received: purchases?.filter(p => p.status === 'received').length || 0,
      cancelled: purchases?.filter(p => p.status === 'cancelled').length || 0,
      totalAmount: purchases?.reduce((sum, p) => sum + (p.total || 0), 0) || 0,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error in getPurchaseStats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
