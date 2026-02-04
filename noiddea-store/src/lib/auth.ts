/**
 * Funciones de autenticación - Migrado a SQLite
 * Usa el sistema de sesiones local en lugar de Supabase Auth
 */

import { getServerSession, getCurrentUser } from './session';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

/**
 * Obtener el usuario autenticado en el servidor
 * @returns Usuario autenticado o null
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession();
    if (!session) {
      return null;
    }

    // Obtener información adicional del usuario desde la base de datos
    const { getDatabaseClient } = await import('./db/client');
    const db = getDatabaseClient();
    const user = await db.selectOne<{ id: string; email: string; name: string; phone: string }>(
      `SELECT id, email, name, phone FROM users WHERE id = ?`,
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
    };
  } catch (error) {
    console.error('Error inesperado al obtener usuario:', error);
    return null;
  }
}

/**
 * Verificar si hay una sesión activa
 * @returns true si hay sesión activa, false en caso contrario
 */
export async function hasActiveSession(): Promise<boolean> {
  const session = await getServerSession();
  return !!session;
}

/**
 * Obtener el email del usuario autenticado
 * @returns Email del usuario o null
 */
export async function getAuthUserEmail(): Promise<string | null> {
  const session = await getServerSession();
  return session?.email ?? null;
}

/**
 * Obtener el ID del usuario autenticado
 * @returns ID del usuario o null
 */
export async function getAuthUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.userId ?? null;
}

