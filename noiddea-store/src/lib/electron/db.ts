/**
 * Electron IPC Database Client
 * Provides a unified API for database operations via Electron IPC
 */

declare global {
  interface Window {
    ipcRenderer?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

/**
 * Check if Electron IPC is available
 */
function isElectron(): boolean {
  return typeof window !== 'undefined' && !!window.ipcRenderer;
}

/**
 * Execute a database query
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!isElectron()) {
    throw new Error('Electron IPC not available. This function only works in Electron.');
  }

  const result = await window.ipcRenderer!.invoke('db:query', sql, params);
  
  if (!result.success) {
    throw new Error(result.error || 'Database query failed');
  }

  return result.data || [];
}

/**
 * Execute a query and return a single result
 */
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  if (!isElectron()) {
    throw new Error('Electron IPC not available. This function only works in Electron.');
  }

  const result = await window.ipcRenderer!.invoke('db:queryOne', sql, params);
  
  if (!result.success) {
    throw new Error(result.error || 'Database query failed');
  }

  return result.data || null;
}

/**
 * Execute an INSERT, UPDATE, or DELETE statement
 */
export async function execute(sql: string, params: any[] = []): Promise<{ changes: number; lastInsertRowid?: number }> {
  if (!isElectron()) {
    throw new Error('Electron IPC not available. This function only works in Electron.');
  }

  const result = await window.ipcRenderer!.invoke('db:execute', sql, params);
  
  if (!result.success) {
    throw new Error(result.error || 'Database execution failed');
  }

  return result.data || { changes: 0 };
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction(queries: Array<{ sql: string; params?: any[] }>): Promise<any[]> {
  if (!isElectron()) {
    throw new Error('Electron IPC not available. This function only works in Electron.');
  }

  const result = await window.ipcRenderer!.invoke('db:transaction', queries);
  
  if (!result.success) {
    throw new Error(result.error || 'Database transaction failed');
  }

  return result.data || [];
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  if (!isElectron()) {
    throw new Error('Electron IPC not available. This function only works in Electron.');
  }

  const result = await window.ipcRenderer!.invoke('auth:hashPassword', password);
  
  if (!result.success) {
    throw new Error(result.error || 'Password hashing failed');
  }

  return result.data.hash;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!isElectron()) {
    throw new Error('Electron IPC not available. This function only works in Electron.');
  }

  const result = await window.ipcRenderer!.invoke('auth:verifyPassword', password, hash);
  
  if (!result.success) {
    throw new Error(result.error || 'Password verification failed');
  }

  return result.data.isValid;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  // Use client-side generation for now (can be moved to IPC if needed)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
