'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/auth';
import { getCurrentUserClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar_url?: string | null;
  created_at?: string;
  user_metadata?: {
    name?: string;
    phone?: string;
  };
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUser = async (isInitial = false) => {
      try {
        // Solo setear loading en la carga inicial para evitar re-renders constantes
        if (isInitial) {
          setIsLoading(true);
        }
        
        let currentUser;
        
        // Siempre usar versión cliente en Tauri, incluso si isNative() falla
        // Detectar Tauri de forma más robusta
        const isTauriEnv = typeof window !== 'undefined' && (
          isNative() || 
          '__TAURI_INTERNALS__' in window || 
          '__TAURI__' in window ||
          window.location.protocol === 'tauri:'
        );
        
        if (isTauriEnv) {
          try {
            const result = await getCurrentUserClient();
            currentUser = result.user ? { user: result.user, error: null } : { user: null, error: result.error };
          } catch (clientError) {
            // Si getCurrentUserClient falla, no intentar server action
            console.error('Error en getCurrentUserClient:', clientError);
            currentUser = { user: null, error: clientError instanceof Error ? clientError.message : 'Error obteniendo usuario' };
          }
        } else {
          // Solo usar server action en modo web (no Tauri)
          try {
            currentUser = await getCurrentUser();
          } catch (serverError) {
            // Si server action falla, podría ser Tauri que no detectamos correctamente
            console.error('Error en getCurrentUser (server):', serverError);
            // Intentar versión cliente como fallback si hay token
            const hasToken = typeof window !== 'undefined' && (
              localStorage.getItem('kapok-session-token') ||
              document.cookie.includes('kapok-session-token=')
            );
            if (hasToken) {
              try {
                const result = await getCurrentUserClient();
                currentUser = result.user ? { user: result.user, error: null } : { user: null, error: result.error };
              } catch (fallbackError) {
                currentUser = { user: null, error: 'Error obteniendo usuario' };
              }
            } else {
              currentUser = { user: null, error: serverError instanceof Error ? serverError.message : 'Error obteniendo usuario' };
            }
          }
        }
        
        if (!isMounted) return;
        
        const newUser = (currentUser as any).user as User | null;
        const newError = (currentUser as any).error;
        
        // Solo actualizar el estado si los datos realmente cambiaron para evitar re-renders innecesarios
        setUser((prevUser) => {
          if (prevUser?.id === newUser?.id && prevUser?.email === newUser?.email) {
            return prevUser; // No cambiar si es el mismo usuario
          }
          return newUser;
        });
        
        if (newError) {
          setError((prevError) => {
            if (prevError?.message === newError) {
              return prevError; // No cambiar si es el mismo error
            }
            return new Error(newError);
          });
        } else {
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error obteniendo usuario:', err);
        const error = err as Error;
        // No mostrar error si es por servidor no disponible en Tauri
        if (error.message?.includes('unexpected response') || error.message?.includes('server')) {
          console.warn('Error de servidor (probablemente Tauri), ignorando error de server action');
          setError(null);
          setUser(null);
        } else {
          setError((prevError) => {
            if (prevError?.message === error.message) {
              return prevError; // No cambiar si es el mismo error
            }
            return error;
          });
          setUser(null);
        }
      } finally {
        if (isMounted && isInitial) {
          setIsLoading(false);
        }
      }
    };

    // Carga inicial
    fetchUser(true);

    // Verificar periódicamente si la sesión sigue activa (solo en background, sin forzar re-renders)
    // Usar un intervalo más largo y sin setLoading para evitar re-renders
    const interval = setInterval(() => {
      fetchUser(false); // No es carga inicial, no setear loading
    }, 5 * 60 * 1000); // Verificar cada 5 minutos en lugar de cada minuto

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { user, isLoading, error };
}
