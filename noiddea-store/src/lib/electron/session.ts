/**
 * Session management for Electron using localStorage
 */

const SESSION_KEY = 'kapok-session-token';

export interface SessionUser {
  userId: string;
  email: string;
}

/**
 * Get current session from localStorage
 */
export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem(SESSION_KEY);
  if (!token) return null;

  try {
    // Verify token via IPC
    return JSON.parse(localStorage.getItem('kapok-session-user') || 'null');
  } catch {
    return null;
  }
}

/**
 * Set session in localStorage
 */
export function setSession(userId: string, email: string, token: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(SESSION_KEY, token);
  localStorage.setItem('kapok-session-user', JSON.stringify({ userId, email }));
}

/**
 * Clear session from localStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('kapok-session-user');
}

/**
 * Get session token
 */
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}
