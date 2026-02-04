'use client';

import { useEffect, useState } from 'react';
import { logoutUser } from '@/services';
import { getCurrentUser } from '@/services/auth';
import { getCurrentUserClient } from '@/lib/db/client-actions';
import { isNative } from '@/lib/native';

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar_url?: string | null;
  user_metadata?: {
    name?: string;
    phone?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual
    const fetchUser = async () => {
      try {
        // Detectar Tauri de forma robusta
        const isTauriEnv = typeof window !== 'undefined' && (
          isNative() ||
          '__TAURI_INTERNALS__' in window ||
          '__TAURI__' in window ||
          window.location.protocol === 'tauri:'
        );

        let currentUser: User | null = null;

        if (isTauriEnv) {
          try {
            const result = await getCurrentUserClient();
            currentUser = result.user as User | null;
          } catch (clientError) {
            // Si getCurrentUserClient falla, no intentar server action
            console.warn('Error en getCurrentUserClient (Tauri):', clientError);
            currentUser = null;
          }
        } else {
          try {
            currentUser = await getCurrentUser() as User | null;
          } catch (serverError) {
            // Si server action falla y hay token, intentar versión cliente como fallback
            const hasToken = typeof window !== 'undefined' && (
              localStorage.getItem('kapok-session-token') ||
              document.cookie.includes('kapok-session-token=')
            );
            if (hasToken) {
              try {
                const result = await getCurrentUserClient();
                currentUser = result.user as User | null;
              } catch (fallbackError) {
                console.warn('Error en getCurrentUserClient (fallback):', fallbackError);
                currentUser = null;
              }
            } else {
              console.warn('Error en getCurrentUser (server):', serverError);
              currentUser = null;
            }
          }
        }

        setUser(currentUser);
      } catch (error) {
        // No mostrar errores de server actions en Tauri (esperados)
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (!errorMsg.includes('unexpected response') && !errorMsg.includes('server')) {
          console.error('Error obteniendo usuario:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Verificar periódicamente si la sesión sigue activa (menos frecuente)
    const interval = setInterval(() => {
      fetchUser();
    }, 5 * 60 * 1000); // Verificar cada 5 minutos

    return () => clearInterval(interval);
  }, []);

  const signOut = async () => {
    try {
      // Limpiar localStorage antes de cerrar sesión
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selected-branch-id');
        localStorage.removeItem('kapok-session-token');
      }

      await logoutUser();
      setUser(null);

      // Redirigir a /login después de cerrar sesión
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error en signOut:', error);
      // Intentar redirigir de todos modos
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return {
    user,
    loading,
    signOut,
    // Estas funciones ya no son necesarias con el sistema de sesiones basado en cookies
    signIn: async (email: string, password: string) => {
      const { loginUser } = await import('@/services/auth-actions');
      return loginUser({ email, password });
    },
    signInWithOAuth: async (_provider: 'google' | 'github' | 'gitlab') => {
      throw new Error('OAuth no está disponible en modo offline');
    },
  };
}
