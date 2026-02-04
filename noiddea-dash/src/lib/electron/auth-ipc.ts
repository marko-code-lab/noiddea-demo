/**
 * IPC wrapper for auth operations
 */

declare global {
  interface Window {
    ipcRenderer?: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

export async function generateToken(userId: string, email: string): Promise<{ success: boolean; data?: { token: string }; error?: string }> {
  if (!window.ipcRenderer) {
    throw new Error('Electron IPC not available');
  }
  return window.ipcRenderer.invoke('auth:generateToken', userId, email);
}

export async function verifyToken(token: string): Promise<{ success: boolean; data?: { userId: string; email: string } | null; error?: string }> {
  if (!window.ipcRenderer) {
    throw new Error('Electron IPC not available');
  }
  return window.ipcRenderer.invoke('auth:verifyToken', token);
}
