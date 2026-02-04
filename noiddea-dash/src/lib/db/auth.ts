/**
 * Sistema de autenticación propio para reemplazar Supabase Auth
 */

import { getDatabaseClient } from './client';

// En Vite, las variables de entorno deben tener prefijo VITE_
// Para JWT_SECRET, usamos una constante por seguridad (no exponer en cliente)
const JWT_SECRET = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_JWT_SECRET) 
  ? import.meta.env.VITE_JWT_SECRET 
  : 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 días

export interface AuthUser {
  user_id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

/**
 * Hashea una contraseña usando bcrypt
 * Note: bcrypt is dynamically imported to prevent bundling in browser
 */
export async function hashPassword(password: string): Promise<string> {
  // Dynamic import to prevent bcrypt from being bundled in browser
  // bcrypt is a Node.js native module and cannot run in the browser
  if (typeof window !== 'undefined') {
    throw new Error('hashPassword can only be called in a Node.js environment (Electron main process)');
  }
  
  const bcrypt = await import('bcrypt');
  const saltRounds = 10;
  // Handle both default and named exports
  const bcryptLib = bcrypt.default || bcrypt;
  return bcryptLib.hash(password, saltRounds);
}

/**
 * Verifica una contraseña contra un hash
 * Note: bcrypt is dynamically imported to prevent bundling in browser
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Dynamic import to prevent bcrypt from being bundled in browser
  // bcrypt is a Node.js native module and cannot run in the browser
  if (typeof window !== 'undefined') {
    throw new Error('verifyPassword can only be called in a Node.js environment (Electron main process)');
  }
  
  const bcrypt = await import('bcrypt');
  // Handle both default and named exports
  const bcryptLib = bcrypt.default || bcrypt;
  return bcryptLib.compare(password, hash);
}

/**
 * Genera un token JWT para un usuario
 * Note: jsonwebtoken is dynamically imported to prevent bundling in browser
 */
export async function generateToken(userId: string, email: string): Promise<string> {
  // Dynamic import to prevent jsonwebtoken from being bundled in browser
  // jsonwebtoken is a Node.js-only library and cannot run in the browser
  if (typeof window !== 'undefined') {
    throw new Error('generateToken can only be called in a Node.js environment (Electron main process)');
  }
  
  const jwt = await import('jsonwebtoken');
  const jwtLib = jwt.default || jwt;
  return jwtLib.sign(
    { userId, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  ) as string;
}

/**
 * Verifica y decodifica un token JWT
 * Note: jsonwebtoken is dynamically imported to prevent bundling in browser
 */
export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    // Dynamic import to prevent jsonwebtoken from being bundled in browser
    // jsonwebtoken is a Node.js-only library and cannot run in the browser
    if (typeof window !== 'undefined') {
      throw new Error('verifyToken can only be called in a Node.js environment (Electron main process)');
    }
    
    const jwt = await import('jsonwebtoken');
    const jwtLib = jwt.default || jwt;
    const decoded = jwtLib.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Crea un usuario de autenticación
 */
export async function createAuthUser(
  userId: string,
  email: string,
  password: string
): Promise<void> {
  const db = getDatabaseClient();
  const passwordHash = await hashPassword(password);
  
  await db.mutate(
    `INSERT INTO auth_users (user_id, email, password_hash) VALUES (?, ?, ?)`,
    [userId, email, passwordHash]
  );
}

/**
 * Autentica un usuario con email y contraseña
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ userId: string; email: string } | null> {
  const db = getDatabaseClient();
  
  const authUser = await db.selectOne<AuthUser>(
    `SELECT * FROM auth_users WHERE email = ?`,
    [email]
  );

  if (!authUser) {
    return null;
  }

  const isValid = await verifyPassword(password, authUser.password_hash);
  if (!isValid) {
    return null;
  }

  // Actualizar último login
  await db.mutate(
    `UPDATE auth_users SET last_login = datetime('now') WHERE user_id = ?`,
    [authUser.user_id]
  );

  return {
    userId: authUser.user_id,
    email: authUser.email,
  };
}

/**
 * Crea una sesión para un usuario
 */
export async function createSession(userId: string, email: string): Promise<string> {
  const db = getDatabaseClient();
  const token = await generateToken(userId, email);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 días

  const sessionId = db.generateId();
  
  await db.mutate(
    `INSERT INTO auth_sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
    [sessionId, userId, token, expiresAt.toISOString()]
  );

  return token;
}

/**
 * Verifica una sesión y retorna el usuario
 */
export async function verifySession(token: string): Promise<{ userId: string; email: string } | null> {
  const db = getDatabaseClient();
  
  // Verificar token JWT primero
  const decoded = await verifyToken(token);
  if (!decoded) {
    return null;
  }

  // Verificar que la sesión existe y no ha expirado
  const session = await db.selectOne<Session>(
    `SELECT * FROM auth_sessions WHERE token = ? AND expires_at > datetime('now')`,
    [token]
  );

  if (!session) {
    return null;
  }

  return decoded;
}

/**
 * Elimina una sesión (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  const db = getDatabaseClient();
  await db.mutate(`DELETE FROM auth_sessions WHERE token = ?`, [token]);
}

/**
 * Elimina todas las sesiones de un usuario
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  const db = getDatabaseClient();
  await db.mutate(`DELETE FROM auth_sessions WHERE user_id = ?`, [userId]);
}

/**
 * Limpia sesiones expiradas
 */
export async function cleanupExpiredSessions(): Promise<void> {
  const db = getDatabaseClient();
  await db.mutate(`DELETE FROM auth_sessions WHERE expires_at < datetime('now')`);
}
