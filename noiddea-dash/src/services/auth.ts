/**
 * Acciones de autenticación - Migrado a SQLite
 * Funciona completamente offline usando SQLite local
 */

import { getServerSession, clearServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';
import { deleteAllUserSessions } from '@/lib/db/auth';

/**
 * Cerrar sesión del usuario actual
 * @returns Objeto con success, shouldRedirect y redirectTo para manejar la redirección en el cliente
 */
export async function signOut(): Promise<{ success: boolean; shouldRedirect: boolean; redirectTo: string }> {
  try {
    const session = await getServerSession();
    
    // Si hay un usuario autenticado, cerrar su sesión de trabajo
    if (session) {
      try {
        const db = getDatabaseClient();
        
        // Obtener la sucursal del usuario para cerrar la sesión correcta
        const branchUser = await db.selectOne<{ branch_id: string }>(
          `SELECT branch_id FROM branches_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
          [session.userId]
        );

        if (branchUser) {
          const { closeUserSession } = await import('./sessions');
          await closeUserSession(session.userId, branchUser.branch_id);
        } else {
          // Si no se encuentra branch, cerrar todas las sesiones del usuario
          const { closeUserSession } = await import('./sessions');
          await closeUserSession(session.userId);
        }
      } catch (sessionError) {
        console.error('Error al cerrar sesión de trabajo:', sessionError);
        // No bloquear el logout si falla el cierre de sesión
      }
    }
    
    // Eliminar todas las sesiones de autenticación del usuario
    if (session) {
      await deleteAllUserSessions(session.userId);
    }
    
    // Limpiar cookie de sesión
    await clearServerSession();
    
    // Retornar un indicador para que el componente maneje la redirección
    return { success: true, shouldRedirect: true, redirectTo: '/login' };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    // Intentar limpiar la cookie de todos modos
    try {
      await clearServerSession();
    } catch (e) {
      console.error('Error limpiando cookie:', e);
    }
    throw new Error('No se pudo cerrar la sesión');
  }
}

/**
 * Obtener el usuario actual autenticado
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession();
    if (!session) {
      return null;
    }

    // Obtener información adicional del usuario desde la base de datos
    const db = getDatabaseClient();
    const user = await db.selectOne<{
      id: string;
      email: string;
      name: string;
      phone: string;
      avatar_url: string | null;
    }>(
      `SELECT id, email, name, phone, avatar_url FROM users WHERE id = ?`,
      [session.userId]
    );

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      // Mantener compatibilidad con el formato de Supabase User
      user_metadata: {
        name: user.name,
        phone: user.phone,
      },
    };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

/**
 * Verificar si el usuario está autenticado
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session;
}

/**
 * Eliminar un usuario completamente del sistema
 * Elimina el usuario de todas las tablas relacionadas
 * 
 * @param userId - ID del usuario a eliminar
 * @returns Objeto con success y mensaje
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validar que se proporcione un userId
    if (!userId) {
      return { success: false, message: 'ID de usuario no proporcionado' };
    }

    const db = getDatabaseClient();

    // 1. Verificar que el usuario existe
    const userData = await db.selectOne<{ id: string; name: string; email: string }>(
      `SELECT id, name, email FROM users WHERE id = ?`,
      [userId]
    );

    if (!userData) {
      return { success: false, message: 'Usuario no encontrado en la base de datos' };
    }

    // 2. Eliminar en transacción para mantener integridad referencial
    await db.transact([
      // Eliminar relaciones con sucursales (branches_users)
      {
        sql: `DELETE FROM branches_users WHERE user_id = ?`,
        params: [userId],
      },
      // Eliminar relaciones con negocios (businesses_users)
      {
        sql: `DELETE FROM businesses_users WHERE user_id = ?`,
        params: [userId],
      },
      // Eliminar sesiones de autenticación
      {
        sql: `DELETE FROM auth_sessions WHERE user_id = ?`,
        params: [userId],
      },
      // Eliminar usuario de autenticación
      {
        sql: `DELETE FROM auth_users WHERE user_id = ?`,
        params: [userId],
      },
      // Eliminar el usuario de la tabla users (esto eliminará en cascada si hay foreign keys)
      {
        sql: `DELETE FROM users WHERE id = ?`,
        params: [userId],
      },
    ]);

    return { 
      success: true, 
      message: `Usuario ${userData.name} (${userData.email}) eliminado correctamente del sistema` 
    };

  } catch (error) {
    console.error('Error inesperado al eliminar usuario:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error desconocido al eliminar usuario' 
    };
  }
}
