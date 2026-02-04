/**
 * Sistema de sesiones para reemplazar Supabase Auth
 * Funciona completamente offline usando SQLite
 */

import { verifyToken, createSession as createAuthSession, deleteSession } from './db/auth';
import { getDatabaseClient } from './db/client';

const SESSION_TOKEN_NAME = 'kapok-session-token';

export interface SessionUser {
  userId: string;
  email: string;
}

/**
 * Obtiene la sesión actual del usuario
 * Note: In TanStack Router, cookie access is handled differently than Next.js
 */
export async function getServerSession(): Promise<SessionUser | null> {
  // In TanStack Router, token access should be handled via client-side or Electron IPC
  // This is a placeholder - actual implementation depends on your routing setup
  let token: string | null = null;

  // Try to get token from localStorage (for client-side)
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(SESSION_TOKEN_NAME);
  }

  if (!token) {
    return null;
  }

  // Verificar el token JWT y la sesión en la base de datos
  const decoded = await verifyToken(token);
  if (!decoded) {
    return null;
  }

  // Verificar que la sesión existe en la base de datos
  const db = getDatabaseClient();
  const session = await db.selectOne<{ id: string; user_id: string; expires_at: string }>(
    `SELECT * FROM auth_sessions WHERE token = ? AND expires_at > datetime('now')`,
    [token]
  );

  if (!session) {
    return null;
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
  };
}

/**
 * Crea una nueva sesión
 * Note: In TanStack Router, token storage should be handled via client-side or Electron IPC
 */
export async function setServerSession(userId: string, email: string): Promise<string> {
  // Crear sesión en la base de datos
  const token = await createAuthSession(userId, email);

  // Store token in localStorage (for client-side)
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_TOKEN_NAME, token);
  }

  return token;
}

/**
 * Elimina la sesión actual
 * Note: In TanStack Router, token removal should be handled via client-side or Electron IPC
 */
export async function clearServerSession(token?: string): Promise<void> {
  if (token) {
    // Eliminar sesión de la base de datos
    await deleteSession(token);
  } else {
    // Obtener token de localStorage (for client-side)
    if (typeof window !== 'undefined') {
      const sessionToken = localStorage.getItem(SESSION_TOKEN_NAME);
      if (sessionToken) {
        await deleteSession(sessionToken);
      }
    }
  }

  // Remove token from localStorage (for client-side)
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_TOKEN_NAME);
  }
}

/**
 * Obtiene el usuario actual basado en la sesión
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return getServerSession();
}
