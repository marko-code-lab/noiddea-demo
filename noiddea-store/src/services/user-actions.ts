/**
 * Actions para gestión de usuarios
 * Migrado a SQLite - Funciona completamente offline
 */

import { getServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';

/**
 * Verifica si el usuario actual tiene un negocio o sucursal asociada
 */
export async function checkUserHasBusiness() {
  try {
    const session = await getServerSession();

    if (!session) {
      console.log('[checkUserHasBusiness] No hay sesión');
      return { hasBusiness: false, authenticated: false };
    }

    console.log('[checkUserHasBusiness] Verificando usuario:', session.userId, session.email);

    const db = getDatabaseClient();

    // Primero verificar si es owner (business level)
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1`,
      [session.userId]
    );

    console.log('[checkUserHasBusiness] Business user encontrado:', businessUser);

    if (businessUser) {
      // Usuario es owner (de businesses_users)
      console.log('[checkUserHasBusiness] Usuario es OWNER, business_id:', businessUser.business_id);
      return {
        hasBusiness: true,
        authenticated: true,
        businessId: businessUser.business_id,
        role: businessUser.role,
        isOwner: businessUser.role === 'owner', // Asegurar que solo 'owner' sea true
        isCashier: false,
      };
    }

    // Si no es owner, verificar si es cashier (branch level)
    const branchUser = await db.selectOne<{
      branch_id: string;
      role: string;
      business_id: string;
    }>(
      `SELECT bu.branch_id, bu.role, b.business_id
       FROM branches_users bu
       INNER JOIN branches b ON b.id = bu.branch_id
       WHERE bu.user_id = ? AND bu.is_active = 1`,
      [session.userId]
    );

    console.log('[checkUserHasBusiness] Branch user encontrado:', branchUser);

    if (branchUser) {
      // Usuario es cashier (de branches_users)
      console.log('[checkUserHasBusiness] Usuario es CASHIER, branch_id:', branchUser.branch_id);
      return {
        hasBusiness: true,
        authenticated: true,
        businessId: branchUser.business_id,
        role: branchUser.role,
        branchId: branchUser.branch_id,
        isOwner: false,
        isCashier: branchUser.role === 'cashier',
      };
    }

    // Usuario no tiene negocio ni sucursal asignada
    console.log('[checkUserHasBusiness] Usuario no tiene negocio ni sucursal asignada');
    return {
      hasBusiness: false,
      authenticated: true,
    };
  } catch (error) {
    console.error('[checkUserHasBusiness] Error:', error);
    return { hasBusiness: false, authenticated: false };
  }
}

/**
 * Obtiene la información del usuario actual
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession();

    if (!session) {
      return { user: null, error: 'No autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener perfil del usuario con benefit de branches_users
    // Priorizar sucursal con sesión activa, sino la más reciente
    const profile = await db.selectOne<{
      id: string;
      email: string;
      name: string;
      phone: string;
      avatar_url: string | null;
      created_at: string;
      benefit: number | null;
    }>(
      `SELECT 
        u.id,
        u.email,
        u.name,
        u.phone,
        u.avatar_url,
        u.created_at,
        COALESCE(
          (SELECT bu.benefit 
           FROM branches_users bu
           INNER JOIN user_sessions us ON us.branch_id = bu.branch_id AND us.user_id = bu.user_id
           WHERE bu.user_id = u.id AND bu.is_active = 1 AND us.closed_at IS NULL
           ORDER BY us.updated_at DESC
           LIMIT 1),
          (SELECT bu.benefit 
           FROM branches_users bu
           WHERE bu.user_id = u.id AND bu.is_active = 1
           ORDER BY bu.created_at DESC
           LIMIT 1)
        ) as benefit
       FROM users u
       WHERE u.id = ?`,
      [session.userId]
    );

    if (!profile) {
      console.error('Error obteniendo perfil: usuario no encontrado');
      return { user: null, error: 'Error obteniendo perfil' };
    }

    return { user: profile, error: null };
  } catch (error) {
    console.error('Error en getCurrentUser:', error);
    return { user: null, error: 'Error desconocido' };
  }
}

/**
 * Crea un nuevo owner (business level)
 */
export async function createAdminUser(data: {
  email: string;
  name: string;
  phone: string;
  password: string;
  businessId: string;
  role: 'owner';
}) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'No autenticado' };
    }

    const db = getDatabaseClient();

    // Verificar que el usuario actual tenga permisos
    const currentBusinessUser = await db.selectOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1`,
      [session.userId, data.businessId]
    );

    if (!currentBusinessUser || currentBusinessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear owners',
      };
    }

    // Verificar que el email no esté registrado
    const existingUser = await db.selectOne<{ id: string }>(
      `SELECT id FROM users WHERE email = ?`,
      [data.email]
    );

    if (existingUser) {
      return {
        success: false,
        error: 'Este correo ya está registrado',
      };
    }

    // Generar IDs
    const userId = db.generateId();
    const businessUserId = db.generateId();

    // Hashear password
    const { hashPassword } = await import('@/lib/db/auth');
    const passwordHash = await hashPassword(data.password);

    // Crear todo en una transacción
    await db.transact([
      // 1. Crear usuario en tabla users
      {
        sql: `INSERT INTO users (id, email, name, phone) VALUES (?, ?, ?, ?)`,
        params: [userId, data.email, data.name, data.phone],
      },
      // 2. Crear usuario de autenticación
      {
        sql: `INSERT INTO auth_users (user_id, email, password_hash) VALUES (?, ?, ?)`,
        params: [userId, data.email, passwordHash],
      },
      // 3. Asignar rol en businesses_users
      {
        sql: `INSERT INTO businesses_users (id, user_id, business_id, role, is_active) VALUES (?, ?, ?, ?, ?)`,
        params: [businessUserId, userId, data.businessId, data.role, 1],
      },
    ]);

    // Note: In TanStack Router, we don't use revalidatePath

    return { success: true, data: { id: userId, email: data.email } };
  } catch (error) {
    console.error('Error en createAdminUser:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Función eliminada: Ya no se crean managers
 * Solo se crean Owners (business level) y Cashiers (branch level)
 */

/**
 * Crea un nuevo empleado (cashier)
 */
export async function createBranchEmployee(data: {
  email: string;
  name: string;
  phone: string;
  password: string;
  branchId: string;
  role: 'cashier';
  benefit?: number;
}) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'No autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener la sucursal para verificar el business_id
    const branch = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM branches WHERE id = ?`,
      [data.branchId]
    );

    if (!branch) {
      return { success: false, error: 'Sucursal no encontrada' };
    }

    // Verificar que el usuario actual sea owner del business
    const currentBusinessUser = await db.selectOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1`,
      [session.userId, branch.business_id]
    );

    if (!currentBusinessUser || currentBusinessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear empleados',
      };
    }

    // Verificar que el email no esté registrado
    const existingUser = await db.selectOne<{ id: string }>(
      `SELECT id FROM users WHERE email = ?`,
      [data.email]
    );

    if (existingUser) {
      return {
        success: false,
        error: 'Este correo ya está registrado',
      };
    }

    // Generar IDs
    const userId = db.generateId();
    const branchUserId = db.generateId();

    // Hashear password
    const { hashPassword } = await import('@/lib/db/auth');
    const passwordHash = await hashPassword(data.password);

    // Crear todo en una transacción
    await db.transact([
      // 1. Crear usuario en tabla users
      {
        sql: `INSERT INTO users (id, email, name, phone) VALUES (?, ?, ?, ?)`,
        params: [userId, data.email, data.name, data.phone],
      },
      // 2. Crear usuario de autenticación
      {
        sql: `INSERT INTO auth_users (user_id, email, password_hash) VALUES (?, ?, ?)`,
        params: [userId, data.email, passwordHash],
      },
      // 3. Asignar a la sucursal en branches_users
      {
        sql: `INSERT INTO branches_users (id, user_id, branch_id, role, is_active, benefit) VALUES (?, ?, ?, ?, ?, ?)`,
        params: [branchUserId, userId, data.branchId, data.role, 1, data.benefit || null],
      },
    ]);

    return { success: true, data: { id: userId, email: data.email } };
  } catch (error) {
    console.error('Error en createBranchEmployee:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Verifica si existen usuarios con rol owner en la base de datos
 * Funciona tanto en servidor como en cliente Electron
 * @param userIdParam - Opcional: userId del usuario. Si no se proporciona, se intenta obtener de la sesión
 */
export async function checkOwners(userIdParam?: string) {
  try {
    let userId: string | null = userIdParam || null;
    
    // Si no se proporciona userId, intentar obtenerlo de la sesión
    if (!userId) {
      try {
        const session = await getServerSession();
        if (session) {
          userId = session.userId;
        }
      } catch (sessionError) {
        console.warn('[checkOwners] Error obteniendo sesión:', sessionError);
      }
    }

    if (!userId) {
      console.log('[checkOwners] No hay userId, no se puede verificar');
      return {
        success: false,
        error: 'No autenticado',
        activeOwners: 0,
        allOwners: 0,
        currentUserIsOwner: false,
        owners: [],
        allOwnersData: [],
        roleSummary: [],
      };
    }

    const db = getDatabaseClient();
    
    console.log('[checkOwners] Verificando owners para usuario:', userId);
    
    const owners = await db.select<{
      id: string;
      user_id: string;
      business_id: string;
      role: string;
      is_active: number;
      created_at: string;
      email: string;
      user_name: string;
      business_name: string | null;
    }>(
      `SELECT 
        bu.id,
        bu.user_id,
        bu.business_id,
        bu.role,
        bu.is_active,
        bu.created_at,
        u.email,
        u.name as user_name,
        b.name as business_name
      FROM businesses_users bu
      INNER JOIN users u ON u.id = bu.user_id
      LEFT JOIN businesses b ON b.id = bu.business_id
      WHERE bu.role = 'owner' AND bu.is_active = 1`
    );

    console.log('[checkOwners] Owners activos encontrados:', owners.length);

    const allOwners = await db.select<{
      user_id: string;
      business_id: string;
      role: string;
      is_active: number;
      email: string;
      user_name: string;
      business_name: string | null;
    }>(
      `SELECT 
        bu.user_id,
        bu.business_id,
        bu.role,
        bu.is_active,
        u.email,
        u.name as user_name,
        b.name as business_name
      FROM businesses_users bu
      INNER JOIN users u ON u.id = bu.user_id
      LEFT JOIN businesses b ON b.id = bu.business_id
      WHERE bu.role = 'owner'`
    );

    const roleSummary = await db.select<{
      role: string;
      total: number;
      active: number;
    }>(
      `SELECT 
        role, 
        COUNT(*) as total, 
        SUM(is_active) as active
      FROM businesses_users
      GROUP BY role`
    );

    // Verificar específicamente el usuario actual
    const currentUserOwner = await db.selectOne<{
      user_id: string;
      business_id: string;
      role: string;
      is_active: number;
      email: string;
      user_name: string;
      business_name: string | null;
    }>(
      `SELECT 
        bu.user_id,
        bu.business_id,
        bu.role,
        bu.is_active,
        u.email,
        u.name as user_name,
        b.name as business_name
      FROM businesses_users bu
      INNER JOIN users u ON u.id = bu.user_id
      LEFT JOIN businesses b ON b.id = bu.business_id
      WHERE bu.user_id = ? AND bu.role = 'owner' AND bu.is_active = 1`,
      [userId]
    );

    console.log('[checkOwners] Usuario actual como owner:', currentUserOwner ? 'Sí' : 'No');
    if (currentUserOwner) {
      console.log('[checkOwners] Detalles:', {
        email: currentUserOwner.email,
        business: currentUserOwner.business_name,
        role: currentUserOwner.role,
        isActive: currentUserOwner.is_active,
      });
    }

    return {
      success: true,
      activeOwners: owners.length,
      allOwners: allOwners.length,
      currentUserIsOwner: !!currentUserOwner,
      owners: owners.map(o => ({
        id: o.id,
        userId: o.user_id,
        email: o.email,
        name: o.user_name,
        businessId: o.business_id,
        businessName: o.business_name,
        role: o.role,
        isActive: o.is_active === 1,
        createdAt: o.created_at,
      })),
      allOwnersData: allOwners.map(o => ({
        userId: o.user_id,
        email: o.email,
        name: o.user_name,
        businessId: o.business_id,
        businessName: o.business_name,
        role: o.role,
        isActive: o.is_active === 1,
      })),
      roleSummary: roleSummary.map(r => ({
        role: r.role,
        total: r.total,
        active: r.active,
      })),
    };
  } catch (error) {
    console.error('[checkOwners] Error verificando owners:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      activeOwners: 0,
      allOwners: 0,
      currentUserIsOwner: false,
      owners: [],
      allOwnersData: [],
      roleSummary: [],
    };
  }
}

/**
 * Obtiene todos los usuarios de branches_users (solo cashiers)
 * Si se proporciona branchId, filtra solo los usuarios de esa sucursal
 */
export async function getBusinessUsers(branchId?: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado', users: [] };
    }

    const db = getDatabaseClient();

    // Obtener el business_id del usuario actual
    let targetBusinessId: string | null = null;

    // Primero intentar buscar en businesses_users (owner)
    const businessUser = await db.selectOne<{ business_id: string; role: string }>(
      `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId]
    );

    if (businessUser) {
      targetBusinessId = businessUser.business_id;
    } else {
      // Si no está en businesses_users, buscar en branches_users (cashier)
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
      return { success: false, error: 'No tienes un negocio asociado', users: [] };
    }

    // Construir query base
    let sql = `
      SELECT 
        bu.id,
        bu.user_id,
        bu.role,
        bu.branch_id,
        bu.benefit,
        bu.is_active,
        u.id as user_table_id,
        u.email,
        u.name,
        u.phone,
        b.id as branch_table_id,
        b.name as branch_name
      FROM branches_users bu
      INNER JOIN users u ON u.id = bu.user_id
      INNER JOIN branches b ON b.id = bu.branch_id
      WHERE b.business_id = ? AND bu.is_active = 1 AND bu.role = 'cashier'
    `;
    const params: any[] = [targetBusinessId];

    // Si se proporciona branchId, filtrar por esa sucursal
    if (branchId) {
      sql += ` AND bu.branch_id = ?`;
      params.push(branchId);
    }

    const branchUsers = await db.select<{
      id: string;
      user_id: string;
      role: string;
      branch_id: string;
      benefit: number | null;
      is_active: number;
      user_table_id: string;
      email: string;
      name: string;
      phone: string;
      branch_table_id: string;
      branch_name: string;
    }>(sql, params);

    // Formatear usuarios
    const allUsers = branchUsers.map((bu) => ({
      id: bu.id,
      userId: bu.user_id,
      name: bu.name,
      email: bu.email,
      phone: bu.phone,
      role: bu.role,
      branchId: bu.branch_id,
      branchName: bu.branch_name,
      benefit: bu.benefit,
      isActive: bu.is_active === 1,
      level: 'branch' as const,
    }));

    return { success: true, users: allUsers };
  } catch (error) {
    console.error('Error en getBusinessUsers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      users: [],
    };
  }
}

/**
 * Actualiza un usuario
 */
export async function updateUser(
  userId: string,
  relationId: string,
  level: 'business' | 'branch',
  data: {
    name?: string;
    phone?: string;
    role?: string;
    benefit?: number;
  }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Actualizar datos del usuario en la tabla users
    if (data.name !== undefined || data.phone !== undefined) {
      const updates: string[] = [];
      const params: any[] = [];

      if (data.name !== undefined) {
        updates.push('name = ?');
        params.push(data.name);
      }
      if (data.phone !== undefined) {
        updates.push('phone = ?');
        params.push(data.phone);
      }

      params.push(userId);
      await db.mutate(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    // Actualizar role y benefit según el nivel
    if (level === 'business' && data.role !== undefined) {
      await db.mutate(
        `UPDATE businesses_users SET role = ? WHERE id = ?`,
        [data.role, relationId]
      );
    } else if (level === 'branch') {
      const updates: string[] = [];
      const params: any[] = [];

      if (data.role !== undefined) {
        updates.push('role = ?');
        params.push(data.role);
      }
      if (data.benefit !== undefined) {
        updates.push('benefit = ?');
        params.push(data.benefit);
      }

      if (updates.length > 0) {
        params.push(relationId);
        await db.mutate(
          `UPDATE branches_users SET ${updates.join(', ')} WHERE id = ?`,
          params
        );
      }
    }

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true };
  } catch (error) {
    console.error('Error en updateUser:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Restablece el beneficio de un usuario a 0
 */
export async function resetUserBenefit(relationId: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Resetear el beneficio a 0
    await db.mutate(
      `UPDATE branches_users SET benefit = 0 WHERE id = ?`,
      [relationId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true };
  } catch (error) {
    console.error('Error en resetUserBenefit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina (desactiva) un usuario
 */
export async function deleteUser(
  relationId: string,
  level: 'business' | 'branch'
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener el user_id antes de eliminar la relación
    let userId: string | null = null;

    if (level === 'business') {
      const businessUser = await db.selectOne<{ user_id: string }>(
        `SELECT user_id FROM businesses_users WHERE id = ?`,
        [relationId]
      );

      userId = businessUser?.user_id || null;

      // Eliminar la relación en businesses_users
      await db.mutate(
        `DELETE FROM businesses_users WHERE id = ?`,
        [relationId]
      );
    } else {
      const branchUser = await db.selectOne<{ user_id: string }>(
        `SELECT user_id FROM branches_users WHERE id = ?`,
        [relationId]
      );

      userId = branchUser?.user_id || null;

      // Eliminar la relación en branches_users
      await db.mutate(
        `DELETE FROM branches_users WHERE id = ?`,
        [relationId]
      );
    }

    // Si se obtuvo el userId, eliminar también el usuario de todas las tablas relacionadas
    if (userId) {
      await db.transact([
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
        // Eliminar de la tabla users (esto eliminará en cascada las relaciones restantes)
        {
          sql: `DELETE FROM users WHERE id = ?`,
          params: [userId],
        },
      ]);
    }

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true };
  } catch (error) {
    console.error('Error en deleteUser:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
