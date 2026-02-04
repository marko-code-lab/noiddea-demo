/**
 * Tauri Actions para autenticación y registro básico
 * Usa Tauri IPC para operaciones de base de datos - Funciona completamente offline
 * 
 * ✅ 100% LOCAL: Todas las operaciones usan SQLite local a través de Tauri IPC
 * No requiere conexión a internet
 */

import { queryOne, transaction, generateId, execute } from '@/lib/database';
import {
  loginUserClient
} from '@/lib/db/client-actions';
import { getNativeAPI, isNative } from '@/lib/native';

// Funciones de sesión simples para Tauri (usando localStorage)
const SESSION_KEY = 'kapok-session-token';
const SESSION_USER_KEY = 'kapok-session-user';


function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
  // También limpiar cookie si existe
  document.cookie = `${SESSION_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

function getSession(): { userId: string; email: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem(SESSION_USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

async function deleteAllUserSessions(userId: string): Promise<void> {
  if (typeof window === 'undefined' || !isNative()) {
    return;
  }
  // Eliminar todas las sesiones del usuario usando IPC de Tauri
  await execute(`DELETE FROM auth_sessions WHERE user_id = ?`, [userId]);
}

// ============================================
// Acciones de Autenticación
// ============================================

/**
 * Verifica si existe al menos un business en la base de datos
 * No requiere autenticación
 */
/**
 * Resultado de la verificación de existencia de business
 */
type CheckBusinessResult =
  | { exists: boolean; hasBusiness: boolean }
  | { exists: boolean; hasBusiness: boolean; cannotCheck: true };

/**
 * Verifica si existe un business en la base de datos
 * 100% CLIENTE: Siempre usa IPC de Tauri (queryOne)
 * Nota: Esta función delega a checkBusinessExistsClient() que usa IPC
 */
import { checkBusinessExistsClient } from '@/lib/db/client-actions';

export async function checkBusinessExists(): Promise<CheckBusinessResult> {
  // Siempre usar la función cliente que usa IPC
  return checkBusinessExistsClient();
}

/**
 * Valida que el email no esté registrado
 */
export async function validateEmail(email: string) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Email inválido' };
    }

    // Verificar si el email ya está registrado
    const existingUser = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    if (existingUser) {
      return { success: false, error: 'Este correo ya está registrado' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error validando email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Registra un nuevo usuario con email y contraseña
 * Crea usuario en auth_users, en tabla users y crea el business asociado
 * 100% CLIENTE: Usa IPC de Tauri
 */
export async function signupUser(data: {
  email: string;
  name: string;
  phone: string;
  password: string;
  businessName: string;
  taxId?: string;
}) {
  try {
    // Validar datos
    if (!data.email || !data.name || !data.phone || !data.password || !data.businessName) {
      return { success: false, error: 'Todos los campos son requeridos' };
    }

    if (data.password.length < 8) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres',
      };
    }

    // Verificar que el nombre del negocio no esté en uso
    const existingBusiness = await queryOne<{ id: string }>(
      `SELECT id FROM businesses WHERE name = ?`,
      [data.businessName.trim()]
    );

    if (existingBusiness) {
      return {
        success: false,
        error: 'Este nombre de negocio ya está en uso',
      };
    }

    // Verificar que el email no esté registrado
    const existingUser = await queryOne<{ id: string }>(
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
    const userId = generateId();
    const businessId = generateId();
    const businessUserId = generateId();

    // Hashear password antes de la transacción usando Tauri IPC
    const native = await getNativeAPI();
    if (!native?.auth?.hashPassword) {
      return { success: false, error: 'Auth API no está disponible. Asegúrate de que Tauri esté corriendo.' };
    }
    const hashResult = await native.auth.hashPassword(data.password);
    if (!hashResult.success || !hashResult.data?.hash) {
      return { success: false, error: hashResult.error || 'Error hasheando contraseña' };
    }
    const passwordHash = hashResult.data.hash;

    // ELIMINADO: Creación de branch
    // Ahora trabajamos directamente con business, sin branches
    // Crear todo en una transacción
    await transaction([
      // 1. Crear usuario en tabla users
      {
        sql: `INSERT INTO users (id, email, name, phone) VALUES (?, ?, ?, ?)`,
        params: [userId, data.email, data.name, data.phone],
      },
      // 2. Crear usuario de autenticación con password hasheado
      {
        sql: `INSERT INTO auth_users (user_id, email, password_hash) VALUES (?, ?, ?)`,
        params: [userId, data.email, passwordHash],
      },
      // 3. Crear el negocio
      {
        sql: `INSERT INTO businesses (id, name, tax_id) VALUES (?, ?, ?)`,
        params: [
          businessId,
          data.businessName.trim(),
          data.taxId?.trim() || 'Pendiente',
        ],
      },
      // 4. Asignar usuario como owner del negocio
      {
        sql: `INSERT INTO businesses_users (id, business_id, user_id, role, is_active) VALUES (?, ?, ?, ?, ?)`,
        params: [businessUserId, businessId, userId, 'owner', 1],
      },
    ]);

    // Verificar que el rol se asignó correctamente
    const verifyOwner = await queryOne<{
      id: string;
      business_id: string;
      user_id: string;
      role: string;
      is_active: number;
    }>(
      `SELECT id, business_id, user_id, role, is_active FROM businesses_users WHERE id = ?`,
      [businessUserId]
    );

    console.log('✅ Usuario registrado:', data.email);
    console.log('✅ Negocio creado:', businessId, data.businessName.trim());
    console.log('✅ Usuario asignado como owner:', userId, '→', businessId);

    if (verifyOwner) {
      console.log('✅ Verificación - Rol asignado correctamente:', {
        id: verifyOwner.id,
        user_id: verifyOwner.user_id,
        business_id: verifyOwner.business_id,
        role: verifyOwner.role,
        is_active: verifyOwner.is_active,
      });

      if (verifyOwner.role !== 'owner' || verifyOwner.is_active !== 1) {
        console.error('❌ ERROR: El rol no se asignó correctamente!', verifyOwner);
      }
    } else {
      console.error('❌ ERROR: No se pudo verificar el rol asignado!');
    }

    return {
      success: true,
      userId,
      email: data.email,
      businessId,
      businessName: data.businessName.trim(),
    };
  } catch (error) {
    console.error('Error en signupUser:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Inicia sesión con email y contraseña
 * Retorna información sobre si el usuario tiene un negocio
 */
export async function loginUser(data: { email: string; password: string }) {
  try {
    // Validar datos
    if (!data.email || !data.password) {
      return { success: false, error: 'Email y contraseña son requeridos' };
    }

    // Solo funciona en Tauri
    if (typeof window === 'undefined' || !isNative()) {
      return {
        success: false,
        error: 'Para iniciar sesión debes ejecutar la aplicación con Tauri: npm run tauri dev',
      };
    }

    // Usar la función cliente de Tauri
    return await loginUserClient(data);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Cierra la sesión del usuario
 * Limpia la sesión (redirección debe hacerse en el componente que llama)
 */
export async function logoutUser() {
  try {
    const session = getSession();
    if (session) {
      // Eliminar todas las sesiones del usuario
      await deleteAllUserSessions(session.userId);
    }

    // Limpiar sesión local
    clearSession();

    console.log('✅ Sesión cerrada correctamente');
  } catch (error) {
    console.error('Error en logoutUser:', error);
    // Aún así intentar limpiar la sesión
    try {
      clearSession();
    } catch (e) {
      console.error('Error limpiando sesión:', e);
    }
  }
}
