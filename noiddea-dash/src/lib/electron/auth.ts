/**
 * Authentication utilities for Electron client
 */

import { queryOne, execute, verifyPassword, generateId } from './db';
import { setSession } from './session';
import * as authIpc from './auth-ipc';

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ userId: string; email: string } | null> {
  const authUser = await queryOne<{
    user_id: string;
    email: string;
    password_hash: string;
  }>(
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

  // Update last login
  await execute(
    `UPDATE auth_users SET last_login = datetime('now') WHERE user_id = ?`,
    [authUser.user_id]
  );

  return {
    userId: authUser.user_id,
    email: authUser.email,
  };
}

/**
 * Create a session for a user
 */
export async function createSession(userId: string, email: string): Promise<string> {
  const tokenResult = await authIpc.generateToken(userId, email);
  if (!tokenResult.success || !tokenResult.data?.token) {
    throw new Error('Failed to generate token');
  }

  const token = tokenResult.data.token;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const sessionId = generateId();

  await execute(
    `INSERT INTO auth_sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)`,
    [sessionId, userId, token, expiresAt.toISOString()]
  );

  // Store session in localStorage
  setSession(userId, email, token);

  return token;
}

/**
 * Verify a session and return the user
 */
export async function verifySession(token: string): Promise<{ userId: string; email: string } | null> {
  // Verify token JWT first
  const decodedResult = await authIpc.verifyToken(token);
  if (!decodedResult.success || !decodedResult.data) {
    return null;
  }

  // Verify that the session exists and hasn't expired
  const session = await queryOne<{
    id: string;
    user_id: string;
    expires_at: string;
  }>(
    `SELECT * FROM auth_sessions WHERE token = ? AND expires_at > datetime('now')`,
    [token]
  );

  if (!session) {
    return null;
  }

  return decodedResult.data;
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  await execute(`DELETE FROM auth_sessions WHERE token = ?`, [token]);
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await execute(`DELETE FROM auth_sessions WHERE user_id = ?`, [userId]);
}
