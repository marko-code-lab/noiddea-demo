/**
 * Native API access for Tauri
 * Provides access to native APIs through Tauri's invoke system
 */

import type { NativeAPI } from '@/types/native';
import { invoke } from '@tauri-apps/api/core';

declare global {
  interface Window {
    __TAURI__?: any;
  }
}

/**
 * Check if we're running in Tauri
 * Uses multiple detection methods for robustness across Tauri v1 and v2
 */
export function isTauri(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Detección robusta de Tauri (compatible con v1 y v2)
  // Verificar múltiples formas de detectar Tauri
  try {
    return !!(
      window.__TAURI__ ||
      ('__TAURI_INTERNALS__' in window) ||
      ('__TAURI__' in window) ||
      (window.location && window.location.protocol === 'tauri:')
    );
  } catch (e) {
    // Si hay algún error accediendo a window.location, solo verificar las propiedades
    return !!(
      window.__TAURI__ ||
      ('__TAURI_INTERNALS__' in window) ||
      ('__TAURI__' in window)
    );
  }
}

/**
 * Check if we're running in a native environment (Tauri)
 */
export function isNative(): boolean {
  return isTauri();
}

/**
 * Get the native API interface for Tauri
 */
export async function getNativeAPI(): Promise<NativeAPI | null> {
  // Verificar Tauri usando la misma lógica robusta
  if (!isTauri()) {
    return null;
  }

  try {
    // Intentar obtener la plataforma, pero no fallar si no está disponible
    let platform = 'unknown';
    try {
      // Intentar diferentes formatos de invocación con timeout
      const platformPromise = Promise.race([
        invoke<string>('platform_get'),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000)
        )
      ]).catch(() => {
        // Si falla, intentar el otro formato
        return Promise.race([
          invoke<string>('platform:get'),
          new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          )
        ]);
      }).catch(() => 'unknown');
      
      platform = await platformPromise;
    } catch (e) {
      // Si falla, usar 'unknown' como valor por defecto
      console.warn('⚠️ [getNativeAPI] No se pudo obtener la plataforma, usando "unknown":', e);
    }
    
    return {
      app: {
        getVersion: () => invoke<string>('app_get_version'),
        getPath: (name: string) => invoke<string>('app_get_path', { name }),
        restart: () => invoke<void>('app_restart'),
      },
      db: {
        getPath: () => invoke<string>('db_get_path'),
        exists: () => invoke<boolean>('db_exists'),
        query: (sql: string, params?: any[]) => 
          invoke<{ success: boolean; data?: any; error?: string }>('db_query', { sql, params: params || [] }),
        execute: (sql: string, params?: any[]) => 
          invoke<{ success: boolean; data?: any; error?: string }>('db_execute', { sql, params: params || [] }),
        exec: (sql: string) => 
          invoke<{ success: boolean; data?: any; error?: string }>('db_exec', { sql }),
        transaction: (queries: Array<{ sql: string; params?: any[] }>) => 
          invoke<{ success: boolean; data?: any; error?: string }>('db_transaction', { queries }),
      },
      auth: {
        hashPassword: (password: string) => 
          invoke<{ success: boolean; data?: { hash: string }; error?: string }>('auth_hash_password', { password }),
        verifyPassword: (password: string, hash: string) => 
          invoke<{ success: boolean; data?: { isValid: boolean }; error?: string }>('auth_verify_password', { password, hash }),
        generateToken: (userId: string, email: string) => 
          invoke<{ success: boolean; data?: { token: string }; error?: string }>('auth_generate_token', { userId, email }),
      },
      window: {
        minimize: () => invoke<void>('window_minimize'),
        maximize: () => invoke<void>('window_maximize'),
        close: () => invoke<void>('window_close'),
        isMaximized: () => invoke<boolean>('window_is_maximized'),
      },
      script: {
        resetDatabase: () => invoke<string>('script_reset_database'),
      },
      platform,
      isTauri: true,
    };
  } catch (error) {
    console.error('Error initializing Tauri API:', error);
    return null;
  }
}
