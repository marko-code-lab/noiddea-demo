
import { getServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';

/**
 * Obtiene el userId de la sesión actual
 * Intenta múltiples métodos para obtener la sesión
 */
async function getSessionUserId(): Promise<string | null> {
  try {
    // Método 1: Intentar obtener sesión usando getServerSession
    try {
      const session = await getServerSession();
      if (session && session.userId) {
        console.log('[getDashboardStats] Sesión obtenida via getServerSession:', session.userId);
        return session.userId;
      }
    } catch (sessionError) {
      console.warn('[getDashboardStats] Error obteniendo sesión con getServerSession:', sessionError);
    }

    // Método 2: Si estamos en un contexto donde podemos acceder a cookies directamente
    // Note: In TanStack Router, cookie access is handled differently
    // This method is disabled as it's Next.js-specific
    try {
      // const { verifyToken } = await import('@/lib/db/auth');
      // Cookie access would need to be handled via client-side or Electron IPC
      // const token = cookieStore.get('kapok-session-token')?.value;
      
      if (token) {
        console.log('[getDashboardStats] Token encontrado en cookies, verificando...');
        const decoded = verifyToken(token);
        if (decoded && decoded.userId) {
          // Verificar que la sesión existe en la base de datos
          const db = getDatabaseClient();
          const sessionCheck = await db.selectOne<{ id: string }>(
            `SELECT id FROM auth_sessions WHERE token = ? AND expires_at > datetime('now')`,
            [token]
          );
          
          if (sessionCheck) {
            console.log('[getDashboardStats] Sesión obtenida via token directo:', decoded.userId);
            return decoded.userId;
          } else {
            console.warn('[getDashboardStats] Token válido pero sesión expirada o no encontrada en BD');
          }
        }
      }
    } catch (cookieError) {
      console.warn('[getDashboardStats] Error obteniendo sesión de cookies:', cookieError);
    }

    console.error('[getDashboardStats] No se pudo obtener sesión por ningún método');
    return null;
  } catch (error) {
    console.error('[getDashboardStats] Error crítico obteniendo sesión:', error);
    return null;
  }
}

/**
 * Obtiene las estadísticas del dashboard
 * @param userId - Opcional: userId del usuario. Si no se proporciona, se intenta obtener de la sesión
 */
export async function getDashboardStats(userIdParam?: string) {
  try {
    // Si se proporciona userId como parámetro, usarlo directamente
    let userId: string | undefined = userIdParam;
    
    // Si no se proporciona, intentar obtenerlo de la sesión
    if (!userId) {
      const sessionUserId = await getSessionUserId();
      userId = sessionUserId || undefined;
    }
    
      if (!userId) {
      console.error('[getDashboardStats] No hay userId - usuario no autenticado');
      // Note: In TanStack Router, cookie access is handled differently
      // Cookie access would need to be handled via client-side or Electron IPC
      try {
        // const { cookies } = await import('next/headers');
        // const cookieStore = await cookies();
        // const token = cookieStore.get('kapok-session-token')?.value;
        if (token) {
          const { verifyToken } = await import('@/lib/db/auth');
          const decoded = verifyToken(token);
          if (decoded?.userId) {
            console.log('[getDashboardStats] Usando userId del token decodificado:', decoded.userId);
            userId = decoded.userId;
          }
        }
      } catch (e) {
        console.warn('[getDashboardStats] No se pudo obtener userId del token:', e);
      }
      
      if (!userId) {
        return { success: false, error: 'Debes estar autenticado' };
      }
    }

    // Limpiar userId por si acaso hay espacios
    userId = userId.trim();

    console.log('[getDashboardStats] Obteniendo estadísticas para userId:', userId, 'Tipo:', typeof userId, 'Longitud:', userId.length);
    const db = getDatabaseClient();

    // Verificar primero si el usuario existe en la tabla users
    const userExists = await db.selectOne<{ id: string; email: string; name: string }>(
      `SELECT id, email, name FROM users WHERE id = ?`,
      [userId]
    );
    console.log('[getDashboardStats] Usuario existe en BD:', userExists);
    
    if (!userExists) {
      console.error('[getDashboardStats] ERROR: El usuario no existe en la tabla users con ID:', userId);
      // Buscar usuarios similares para debugging
      const allUsers = await db.select<{ id: string; email: string; name: string }>(
        `SELECT id, email, name FROM users LIMIT 10`
      );
      console.log('[getDashboardStats] Primeros 10 usuarios en BD:', allUsers);
      return { success: false, error: 'Usuario no encontrado en la base de datos' };
    }

    // Obtener el business_id del usuario actual
    let targetBusinessId: string | null = null;

    // Primero buscar en businesses_users (owner)
    const businessUser = await db.selectOne<{ 
      business_id: string; 
      role: string;
      is_active: number;
    }>(
      `SELECT business_id, role, is_active FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [userId]
    );

    console.log('[getDashboardStats] Business user encontrado en businesses_users:', businessUser);

    if (businessUser) {
      targetBusinessId = businessUser.business_id;
      console.log('[getDashboardStats] Usuario es owner, business_id:', targetBusinessId);
    } else {
      // Si no es owner, buscar en branches_users (cashier)
      const branchUser = await db.selectOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [userId]
      );

      console.log('[getDashboardStats] Branch user encontrado en branches_users:', branchUser);

      if (branchUser) {
        targetBusinessId = branchUser.business_id;
        console.log('[getDashboardStats] Usuario es cashier, business_id:', targetBusinessId);
      }
    }

    // Debug: Verificar todos los registros de businesses_users para este usuario
    const allBusinessUsers = await db.select<{ 
      id: string;
      business_id: string;
      user_id: string;
      role: string;
      is_active: number;
    }>(
      `SELECT id, business_id, user_id, role, is_active FROM businesses_users WHERE user_id = ?`,
      [userId]
    );
    console.log('[getDashboardStats] Todos los registros de businesses_users para este usuario:', allBusinessUsers);

    if (!targetBusinessId) {
      console.error('[getDashboardStats] No se encontró business_id. Usuario:', userId, 'Registros encontrados:', allBusinessUsers);
      return {
        success: false,
        error: 'No tienes un negocio asociado',
      };
    }

    // Obtener todas las sucursales del negocio
    const branches = await db.select<{ id: string }>(
      `SELECT id FROM branches WHERE business_id = ?`,
      [targetBusinessId]
    );

    if (!branches || branches.length === 0) {
      return {
        success: true,
        data: {
          totalRevenue: 0,
          newCustomers: 0,
          productsSold: 0,
          growthRate: 0,
          chartData: [],
          recentSessions: [],
        },
      };
    }

    const branchIds = branches.map(b => b.id);
    const branchPlaceholders = branchIds.map(() => '?').join(',');

    // Obtener sesiones de los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions30d = await db.select<any>(
      `SELECT * FROM user_sessions 
       WHERE branch_id IN (${branchPlaceholders}) 
       AND created_at >= ? 
       ORDER BY created_at DESC`,
      [...branchIds, thirtyDaysAgo.toISOString()]
    );

    // Obtener sesiones del mes anterior para comparar
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const sessionsPreviousMonth = await db.select<any>(
      `SELECT * FROM user_sessions 
       WHERE branch_id IN (${branchPlaceholders}) 
       AND created_at >= ? 
       AND created_at < ?`,
      [...branchIds, sixtyDaysAgo.toISOString(), thirtyDaysAgo.toISOString()]
    );

    const getNumericValue = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'number') return parsed;
        } catch {}
        return parseFloat(value) || 0;
      }
      return 0;
    };

    const getSessionTotal = (session: any): number => {
      try {
        const paymentTotals = typeof session.payment_totals === 'string' 
          ? JSON.parse(session.payment_totals) 
          : (session.payment_totals || {});
        
        // Usar total_sales si existe, sino calcular desde payment_totals
        if (session.total_sales) {
          return Number(session.total_sales) || 0;
        }
        
        return (
          getNumericValue(paymentTotals.cash) + 
          getNumericValue(paymentTotals.digital_wallet) + 
          getNumericValue(paymentTotals.card) + 
          getNumericValue(paymentTotals.transfer)
        );
      } catch {
        return Number(session.total_sales) || 0;
      }
    };

    const totalRevenue = (sessions30d || []).reduce((sum: number, session: any) => 
      sum + getSessionTotal(session), 0);

    const previousRevenue = (sessionsPreviousMonth || []).reduce((sum: number, session: any) => 
      sum + getSessionTotal(session), 0);

    const growthRate = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : totalRevenue > 0 ? 100 : 0;

    const uniqueUsers = new Set((sessions30d || []).map((s: any) => s.user_id).filter(Boolean));
    const newCustomers = uniqueUsers.size;
    const productsSold = sessions30d?.length || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessions7d = await db.select<any>(
      `SELECT * FROM user_sessions 
       WHERE branch_id IN (${branchPlaceholders}) 
       AND created_at >= ? 
       ORDER BY created_at ASC`,
      [...branchIds, sevenDaysAgo.toISOString()]
    );

    // Agrupar por día
    const chartDataMap = new Map<string, number>();
    const today = new Date();
    
    // Inicializar los últimos 7 días con 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      chartDataMap.set(dateKey, 0);
    }

    (sessions7d || []).forEach((session: any) => {
      const date = new Date(session.created_at);
      const dateKey = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      const total = getSessionTotal(session);
      chartDataMap.set(dateKey, (chartDataMap.get(dateKey) || 0) + total);
    });

    const chartData = Array.from(chartDataMap.entries()).map(([date, value]) => ({
      date,
      value: Math.round(value),
    }));

    const recentSessionsData = (sessions30d || []).slice(0, 8);
    const userIds = [...new Set(recentSessionsData.map((s: any) => s.user_id).filter(Boolean))] as string[];
    const branchIdsForSessions = [...new Set(recentSessionsData.map((s: any) => s.branch_id).filter(Boolean))] as string[];

    if (userIds.length > 0 && branchIdsForSessions.length > 0) {
      const userPlaceholders = userIds.map(() => '?').join(',');
      const branchPlaceholdersForSessions = branchIdsForSessions.map(() => '?').join(',');

      const usersData = await db.select<{ id: string; name: string }>(
        `SELECT id, name FROM users WHERE id IN (${userPlaceholders})`,
        userIds
      );

      const branchesData = await db.select<{ id: string; name: string }>(
        `SELECT id, name FROM branches WHERE id IN (${branchPlaceholdersForSessions})`,
        branchIdsForSessions
      );

      const usersMap = new Map(usersData.map(u => [u.id, u]));
      const branchesMap = new Map(branchesData.map(b => [b.id, b]));

      const recentSessions = recentSessionsData.map((session: any) => ({
        id: session.id,
        header: `${usersMap.get(session.user_id)?.name || 'Usuario'} - ${branchesMap.get(session.branch_id)?.name || 'Sucursal'}`,
        type: session.closed_at ? 'Finalizada' : 'En curso',
        status: session.closed_at ? 'Done' : 'In Process',
        reviewer: usersMap.get(session.user_id)?.name || 'N/A',
        total: getSessionTotal(session),
        created_at: session.created_at,
      }));

      return {
        success: true,
        data: {
          totalRevenue,
          newCustomers,
          productsSold,
          growthRate: Math.round(growthRate * 10) / 10,
          chartData,
          recentSessions,
        },
      };
    }

    return {
      success: true,
      data: {
        totalRevenue,
        newCustomers,
        productsSold,
        growthRate: Math.round(growthRate * 10) / 10,
        chartData,
        recentSessions: [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

