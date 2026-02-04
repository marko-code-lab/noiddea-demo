
import { getServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';

/**
 * Obtiene todas las sesiones de usuarios de la tienda (user_sessions)
 * Filtra por el negocio del usuario actual
 */
export async function getUserSessions(branchId?: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado', sessions: [] };
    }

    const db = getDatabaseClient();

    let targetBusinessId: string | null = null;

    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (businessUser) {
      targetBusinessId = businessUser.business_id;
    } else {
      const branchUser = await db.selectOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [session.userId]
      );

      if (branchUser) {
        targetBusinessId = branchUser.business_id;
      }
    }

    if (!targetBusinessId) {
      return {
        success: false,
        error: 'No tienes un negocio asociado',
        sessions: [],
      };
    }

    const branches = await db.select<{ id: string }>(
      `SELECT id FROM branches WHERE business_id = ?`,
      [targetBusinessId]
    );

    if (!branches || branches.length === 0) {
      return { success: true, sessions: [] };
    }

    const businessBranchIds = branches.map(b => b.id);
    const branchPlaceholders = businessBranchIds.map(() => '?').join(',');

    let sql = `SELECT * FROM user_sessions WHERE branch_id IN (${branchPlaceholders}) ORDER BY created_at DESC`;
    let params: any[] = [...businessBranchIds];

    if (branchId && businessBranchIds.includes(branchId)) {
      sql = `SELECT * FROM user_sessions WHERE branch_id = ? ORDER BY created_at DESC`;
      params = [branchId];
    }

    const sessions = await db.select<any>(sql, params);

    if (!sessions || sessions.length === 0) {
      return { success: true, sessions: [] };
    }

    const userIds = [...new Set(sessions.map((s: any) => s.user_id).filter(Boolean))] as string[];
    const branchIds = [...new Set(sessions.map((s: any) => s.branch_id).filter(Boolean))] as string[];

    let usersData: any[] = [];
    let branchesData: any[] = [];

    if (userIds.length > 0) {
      const userPlaceholders = userIds.map(() => '?').join(',');
      usersData = await db.select<{ id: string; name: string; email: string; phone: string }>(
        `SELECT id, name, email, phone FROM users WHERE id IN (${userPlaceholders})`,
        userIds
      );
    }

    if (branchIds.length > 0) {
      const branchPlaceholdersForSessions = branchIds.map(() => '?').join(',');
      branchesData = await db.select<{ id: string; name: string; location: string }>(
        `SELECT id, name, location FROM branches WHERE id IN (${branchPlaceholdersForSessions})`,
        branchIds
      );
    }

    const usersMap = new Map(usersData.map(u => [u.id, u]));
    const branchesMap = new Map(branchesData.map(b => [b.id, b]));

    const getNumericValue = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'number') return parsed;
        } catch { }
        return parseFloat(value) || 0;
      }
      return 0;
    };

    const mappedSessions = sessions.map((session: any) => {
      const user = usersMap.get(session.user_id);
      const branch = branchesMap.get(session.branch_id);

      let paymentTotals: any = {};
      try {
        paymentTotals = typeof session.payment_totals === 'string'
          ? JSON.parse(session.payment_totals)
          : (session.payment_totals || {});
      } catch {
        paymentTotals = {};
      }

      const cashAmount = getNumericValue(paymentTotals.cash);
      const digitalWalletAmount = getNumericValue(paymentTotals.digital_wallet);
      const cardAmount = getNumericValue(paymentTotals.card);
      const transferAmount = getNumericValue(paymentTotals.transfer);
      const totalSales = Number(session.total_sales) || 0;
      const totalAmount = totalSales ||
        (cashAmount + digitalWalletAmount + cardAmount + transferAmount);

      return {
        id: session.id,
        user_id: session.user_id,
        branch_id: session.branch_id,
        started_at: session.created_at,
        closed_at: session.closed_at || null,
        created_at: session.created_at,
        cash_amount: cashAmount,
        digital_wallet_amount: digitalWalletAmount,
        card_amount: cardAmount,
        transfer_amount: transferAmount,
        total_amount: totalAmount,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        } : undefined,
        branch: branch ? {
          id: branch.id,
          name: branch.name,
          location: branch.location,
        } : undefined,
      };
    });

    return { success: true, sessions: mappedSessions };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      sessions: [],
    };
  }
}

/**
 * Exporta sesiones a un archivo Excel
 */
export async function exportSessionsToExcel(branchId?: string) {
  try {
    // Obtener sesiones usando la función existente
    const sessionsResult = await getUserSessions(branchId);

    if (!sessionsResult.success) {
      return {
        success: false,
        error: sessionsResult.error || 'Error al obtener sesiones',
      };
    }

    const sessions = sessionsResult.sessions || [];

    if (sessions.length === 0) {
      return {
        success: false,
        error: 'No hay sesiones para exportar',
      };
    }

    const XLSX = await import('xlsx');

    // Crear encabezados
    const headers = [
      'Usuario',
      'Sucursal',
      'Inicio',
      'Fin',
      'Duración',
      'Efectivo',
      'Billetera Digital',
      'Tarjeta',
      'Transferencia',
      'Total',
      'Estado',
    ];

    // Preparar datos
    const data: any[][] = [headers];

    // Función auxiliar para formatear fechas
    const formatDate = (dateString: string | null): string => {
      if (!dateString) return '-';
      try {
        return new Date(dateString).toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return '-';
      }
    };

    // Función auxiliar para calcular duración
    const formatDuration = (startedAt: string, closedAt: string | null): string => {
      if (!closedAt) return 'En curso';

      try {
        const start = new Date(startedAt);
        const end = new Date(closedAt);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        if (hours > 0) {
          return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
      } catch {
        return '-';
      }
    };

    // Procesar cada sesión
    for (const session of sessions) {
      const row = [
        session.user?.name || '-',
        session.branch?.name || '-',
        formatDate(session.started_at),
        formatDate(session.closed_at),
        formatDuration(session.started_at, session.closed_at),
        session.cash_amount || 0,
        session.digital_wallet_amount || 0,
        session.card_amount || 0,
        session.transfer_amount || 0,
        session.total_amount || 0,
        session.closed_at ? 'Finalizada' : 'Activa',
      ];

      data.push(row);
    }

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 20 }, // Usuario
      { wch: 20 }, // Sucursal
      { wch: 18 }, // Inicio
      { wch: 18 }, // Fin
      { wch: 12 }, // Duración
      { wch: 12 }, // Efectivo
      { wch: 18 }, // Billetera Digital
      { wch: 12 }, // Tarjeta
      { wch: 15 }, // Transferencia
      { wch: 12 }, // Total
      { wch: 12 }, // Estado
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sesiones');

    // Generar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Obtener nombre de la sucursal para el nombre del archivo
    let filename = 'reporte-sesiones.xlsx';
    if (branchId) {
      const db = getDatabaseClient();
      const branch = await db.selectOne<{ name: string }>(
        `SELECT name FROM branches WHERE id = ? LIMIT 1`,
        [branchId]
      );

      if (branch?.name) {
        // Limpiar el nombre de la sucursal para usarlo en el nombre del archivo
        const branchName = branch.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = `reporte-sesiones-${branchName}.xlsx`;
      }
    }

    // Convertir buffer a base64 para poder serializarlo
    const base64 = Buffer.from(buffer).toString('base64');

    return {
      success: true,
      base64,
      filename,
      sessionCount: sessions.length,
    };
  } catch (error) {
    console.error('❌ Error exportando sesiones a Excel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Cierra una sesión específica por su ID
 */
export async function closeSessionById(sessionId: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();
    const now = new Date().toISOString();

    // Verificar que la sesión existe y pertenece al negocio del usuario
    const sessionData = await db.selectOne<{ id: string; branch_id: string }>(
      `SELECT id, branch_id FROM user_sessions WHERE id = ? LIMIT 1`,
      [sessionId]
    );

    if (!sessionData) {
      return { success: false, error: 'Sesión no encontrada' };
    }

    // Verificar que el usuario tiene acceso a esta sesión
    let targetBusinessId: string | null = null;

    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (businessUser) {
      targetBusinessId = businessUser.business_id;
    } else {
      const branchUser = await db.selectOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [session.userId]
      );

      if (branchUser) {
        targetBusinessId = branchUser.business_id;
      }
    }

    if (targetBusinessId) {
      const branch = await db.selectOne<{ business_id: string }>(
        `SELECT business_id FROM branches WHERE id = ? LIMIT 1`,
        [sessionData.branch_id]
      );

      if (!branch || branch.business_id !== targetBusinessId) {
        return { success: false, error: 'No tienes permiso para cerrar esta sesión' };
      }
    }

    // Cerrar la sesión
    await db.mutate(
      `UPDATE user_sessions SET closed_at = ?, updated_at = ? WHERE id = ? AND closed_at IS NULL`,
      [now, now, sessionId]
    );

    return { success: true };
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina (archiva) una sesión específica por su ID
 */
export async function deleteSessionById(sessionId: string) {
  console.log('[deleteSessionById] Iniciando eliminación de sesión:', sessionId);
  try {
    const session = await getServerSession();
    console.log('[deleteSessionById] Sesión de usuario:', session?.userId);
    if (!session) {
      console.error('[deleteSessionById] No hay sesión de usuario');
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Verificar que la sesión existe y pertenece al negocio del usuario
    const sessionData = await db.selectOne<{ id: string; branch_id: string; closed_at: string | null }>(
      `SELECT id, branch_id, closed_at FROM user_sessions WHERE id = ? LIMIT 1`,
      [sessionId]
    );

    console.log('[deleteSessionById] Datos de sesión encontrados:', sessionData);

    if (!sessionData) {
      console.error('[deleteSessionById] Sesión no encontrada en BD');
      return { success: false, error: 'Sesión no encontrada' };
    }

    // Verificar que la sesión esté cerrada antes de eliminarla
    console.log('[deleteSessionById] closed_at:', sessionData.closed_at);
    if (!sessionData.closed_at) {
      console.error('[deleteSessionById] Sesión no está cerrada, no se puede eliminar');
      return { success: false, error: 'Solo se pueden archivar sesiones cerradas' };
    }

    // Verificar que el usuario tiene acceso a esta sesión
    let targetBusinessId: string | null = null;

    const businessUser = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (businessUser) {
      targetBusinessId = businessUser.business_id;
    } else {
      const branchUser = await db.selectOne<{ business_id: string }>(
        `SELECT b.business_id 
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [session.userId]
      );

      if (branchUser) {
        targetBusinessId = branchUser.business_id;
      }
    }

    if (targetBusinessId) {
      const branch = await db.selectOne<{ business_id: string }>(
        `SELECT business_id FROM branches WHERE id = ? LIMIT 1`,
        [sessionData.branch_id]
      );

      if (!branch || branch.business_id !== targetBusinessId) {
        return { success: false, error: 'No tienes permiso para eliminar esta sesión' };
      }
    }

    // Eliminar la sesión
    console.log('[deleteSessionById] Ejecutando DELETE para sesión:', sessionId);
    await db.mutate(
      `DELETE FROM user_sessions WHERE id = ?`,
      [sessionId]
    );

    console.log('[deleteSessionById] Sesión eliminada exitosamente');
    return { success: true };
  } catch (error) {
    console.error('[deleteSessionById] Error eliminando sesión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

