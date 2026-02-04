import { getDatabaseClient } from "@/lib/db/client";
import { generateId } from "@/lib/database";
import type { PaymentTotals } from "@/types";

/**
 * Crea una nueva sesión de usuario
 * Se llama cuando el usuario inicia sesión
 */
export async function startUserSession(
  userId: string,
  branchId: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  const db = getDatabaseClient();

  try {
    // Obtener el business_id del usuario para validar el branch
    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
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
        [userId]
      );
      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      if (!businessId) {
        throw new Error('No se pudo identificar el negocio del usuario');
      }
      
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

    // Validar y obtener branch_id real
    let actualBranchId: string = branchId;
    
    if (businessId) {
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
    }

    // Verificar si ya existe una sesión activa para este usuario en esta sucursal
    const existingSession = await db.selectOne<{ id: string }>(
      `SELECT id FROM user_sessions WHERE user_id = ? AND branch_id = ? AND closed_at IS NULL LIMIT 1`,
      [userId, actualBranchId]
    );

    if (existingSession) {
      // Si ya existe una sesión activa, retornar su ID
      return {
        success: true,
        sessionId: existingSession.id
      };
    }

    // Crear nueva sesión con valores iniciales
    const initialPaymentTotals: PaymentTotals = {
      cash: 0,
      card: 0,
      transfer: 0,
      digital_wallet: 0
    };

    const sessionId = generateId();
    const now = new Date().toISOString();

    try {
      console.log('[startUserSession] Intentando crear sesión:', {
        sessionId,
        userId,
        actualBranchId,
        now
      });
      
      await db.mutate(
        `INSERT INTO user_sessions (id, user_id, branch_id, total_bonus, total_sales, payment_totals, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sessionId,
          userId,
          actualBranchId,
          0,
          0,
          JSON.stringify(initialPaymentTotals),
          now,
          now,
        ]
      );
      
      // Verificar que la sesión se creó correctamente
      const createdSession = await db.selectOne<{ id: string }>(
        `SELECT id FROM user_sessions WHERE id = ? LIMIT 1`,
        [sessionId]
      );
      
      if (!createdSession) {
        console.error('[startUserSession] La sesión no se creó correctamente después de la inserción');
        return {
          success: false,
          error: 'La sesión no se creó correctamente'
        };
      }
      
      console.log('[startUserSession] Sesión creada exitosamente:', sessionId);
    } catch (insertError) {
      console.error('[startUserSession] Error al insertar sesión en la base de datos:', insertError);
      return {
        success: false,
        error: `Error al insertar sesión: ${insertError instanceof Error ? insertError.message : 'Error desconocido'}`
      };
    }

    return {
      success: true,
      sessionId
    };
  } catch (error) {
    console.error('Error inesperado al crear sesión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ocurrió un error inesperado al crear la sesión'
    };
  }
}

/**
 * Cierra la sesión activa de un usuario
 * Se llama cuando el usuario cierra sesión
 */
export async function closeUserSession(
  userId: string,
  branchId?: string
): Promise<{ success: boolean; error?: string }> {
  const db = getDatabaseClient();

  try {
    const now = new Date().toISOString();

    if (branchId) {
      // Obtener el business_id del usuario para validar el branch
      const businessUser = await db.selectOne<{ business_id: string }>(
        `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
        [userId]
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
          [userId]
        );
        if (branchUser) {
          businessId = branchUser.business_id;
        }
      }

      // Función auxiliar para obtener o crear una sucursal por defecto
      const getOrCreateDefaultBranch = async (): Promise<string> => {
        if (!businessId) {
          throw new Error('No se pudo identificar el negocio del usuario');
        }
        
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

      // Validar y obtener branch_id real (misma lógica que startUserSession)
      let actualBranchId: string = branchId;
      
      if (businessId) {
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
      } else {
        // Si no hay businessId, validar que el branch existe
        const branch = await db.selectOne<{ id: string }>(
          `SELECT id FROM branches WHERE id = ? LIMIT 1`,
          [actualBranchId]
        );

        if (!branch) {
          return {
            success: false,
            error: 'La sucursal especificada no existe'
          };
        }
      }

      // Cerrar sesión específica de la sucursal usando el actualBranchId
      await db.mutate(
        `UPDATE user_sessions SET closed_at = ?, updated_at = ? WHERE user_id = ? AND branch_id = ? AND closed_at IS NULL`,
        [now, now, userId, actualBranchId]
      );
    } else {
      // Cerrar todas las sesiones activas del usuario
      await db.mutate(
        `UPDATE user_sessions SET closed_at = ?, updated_at = ? WHERE user_id = ? AND closed_at IS NULL`,
        [now, now, userId]
      );
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error inesperado al cerrar sesión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ocurrió un error inesperado al cerrar la sesión'
    };
  }
}

/**
 * Obtiene la sesión activa de un usuario en una sucursal
 */
export async function getActiveSession(
  userId: string,
  branchId: string
): Promise<{ data: any | null; error: string | null }> {
  const db = getDatabaseClient();

  try {
    // Obtener el business_id del usuario para validar el branch
    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
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
        [userId]
      );
      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      if (!businessId) {
        throw new Error('No se pudo identificar el negocio del usuario');
      }
      
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

    // Validar y obtener branch_id real (misma lógica que startUserSession)
    let actualBranchId: string = branchId;
    
    if (businessId) {
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
    } else {
      // Si no hay businessId, validar que el branch existe
      const branch = await db.selectOne<{ id: string }>(
        `SELECT id FROM branches WHERE id = ? LIMIT 1`,
        [actualBranchId]
      );

      if (!branch) {
        return {
          data: null,
          error: 'La sucursal especificada no existe'
        };
      }
    }

    const session = await db.selectOne<any>(
      `SELECT * FROM user_sessions WHERE user_id = ? AND branch_id = ? AND closed_at IS NULL ORDER BY created_at DESC LIMIT 1`,
      [userId, actualBranchId]
    );

    return { data: session || null, error: null };
  } catch (error) {
    console.error('Error inesperado al obtener sesión activa:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Obtiene o crea una sesión activa para un usuario
 * Útil para asegurar que siempre haya una sesión activa
 */
export async function getOrCreateActiveSession(
  userId: string,
  branchId: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  // Primero intentar obtener sesión activa
  const { data: activeSession } = await getActiveSession(userId, branchId);

  if (activeSession) {
    return {
      success: true,
      sessionId: activeSession.id
    };
  }

  // Si no existe, crear una nueva
  return await startUserSession(userId, branchId);
}

/**
 * Actualiza los montos acumulados en la sesión activa
 * Se llama cuando se realiza una venta
 */
export async function updateSessionOnSale(
  userId: string,
  branchId: string,
  saleTotal: number,
  bonus: number,
  paymentMethod: 'cash' | 'card' | 'transfer' | 'digital_wallet'
): Promise<{ success: boolean; error?: string }> {
  const db = getDatabaseClient();

  try {
    // Obtener o crear sesión activa
    const sessionResult = await getOrCreateActiveSession(userId, branchId);
    if (!sessionResult.success || !sessionResult.sessionId) {
      return { success: false, error: 'No se pudo obtener la sesión activa' };
    }

    // Obtener la sesión actual
    const session = await db.selectOne<{
      total_sales: number;
      total_bonus: number;
      payment_totals: string;
    }>(
      `SELECT total_sales, total_bonus, payment_totals FROM user_sessions WHERE id = ? LIMIT 1`,
      [sessionResult.sessionId]
    );

    if (!session) {
      return { success: false, error: 'No se pudo obtener la sesión' };
    }

    // Calcular nuevos valores
    const newTotalSales = (Number(session.total_sales) || 0) + saleTotal;
    const newTotalBonus = (Number(session.total_bonus) || 0) + bonus;

    // Parsear payment_totals (está almacenado como JSON string)
    let currentPaymentTotals: PaymentTotals;
    try {
      currentPaymentTotals = JSON.parse(session.payment_totals || '{}') as PaymentTotals;
    } catch {
      currentPaymentTotals = {
        cash: 0,
        card: 0,
        transfer: 0,
        digital_wallet: 0
      };
    }

    const updatedPaymentTotals: PaymentTotals = {
      ...currentPaymentTotals,
      [paymentMethod]: (currentPaymentTotals[paymentMethod] || 0) + saleTotal
    };

    // Actualizar la sesión
    const now = new Date().toISOString();
    await db.mutate(
      `UPDATE user_sessions 
       SET total_sales = ?, total_bonus = ?, payment_totals = ?, updated_at = ? 
       WHERE id = ?`,
      [
        newTotalSales,
        newTotalBonus,
        JSON.stringify(updatedPaymentTotals),
        now,
        sessionResult.sessionId,
      ]
    );

    return { success: true };
  } catch (error) {
    console.error('Error al actualizar sesión:', error);
    return { success: false, error: 'Error inesperado al actualizar la sesión' };
  }
}

/**
 * Obtiene las ventas realizadas durante la sesión activa
 */
export async function getSessionSales(
  userId: string,
  branchId: string
): Promise<{ data: any[] | null; error: string | null }> {
  const db = getDatabaseClient();

  try {
    // Obtener el business_id del usuario para validar el branch
    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
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
        [userId]
      );
      if (branchUser) {
        businessId = branchUser.business_id;
      }
    }

    // Función auxiliar para obtener o crear una sucursal por defecto
    const getOrCreateDefaultBranch = async (): Promise<string> => {
      if (!businessId) {
        throw new Error('No se pudo identificar el negocio del usuario');
      }
      
      // Buscar la primera sucursal del negocio
      const firstBranch = await db.selectOne<{ id: string }>(
        `SELECT id FROM branches WHERE business_id = ? LIMIT 1`,
        [businessId]
      );
      
      if (firstBranch) {
        return firstBranch.id;
      }
      
      // Si no hay sucursales, crear una por defecto
      const { generateId } = await import('@/lib/database');
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

    // Validar y obtener branch_id real
    let actualBranchId: string = branchId;
    
    if (businessId) {
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
    }

    // Obtener la sesión activa usando el branch_id real
    const { data: session, error: sessionError } = await getActiveSession(userId, actualBranchId);

    if (sessionError || !session) {
      return { data: [], error: null }; // Si no hay sesión, retornar array vacío
    }

    // Obtener ventas desde que se creó la sesión
    // La sesión se crea cuando se hace la primera venta, pero puede haber un pequeño desfase de milisegundos
    // Restar 1 segundo de la fecha de creación de la sesión para asegurar que se incluyan todas las ventas
    const sessionCreatedAt = new Date(session.created_at);
    const oneSecondBefore = new Date(sessionCreatedAt.getTime() - 1000).toISOString();
    
    const sales = await db.select<any>(
      `SELECT * FROM sales 
       WHERE user_id = ? AND branch_id = ? AND created_at >= ? 
       ORDER BY created_at DESC`,
      [userId, actualBranchId, oneSecondBefore]
    );

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

    return { data: salesWithItems || [], error: null };
  } catch (error) {
    console.error('Error inesperado al obtener ventas de sesión:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

