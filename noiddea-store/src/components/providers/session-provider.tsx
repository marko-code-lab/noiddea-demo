'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isNative } from '@/lib/native';
import { checkUserHasBusiness } from '@/services/user-actions';
import { checkUserHasBusinessClient } from '@/lib/db/client-actions';

interface SessionState {
  authenticated: boolean;
  hasBusiness: boolean;
  isOwner: boolean;
  isCashier: boolean;
  businessId?: string;
  branchId?: string;
  role?: string;
  loading: boolean;
}

interface SessionContextType extends SessionState {
  refreshSession: () => Promise<void>;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType>({
  authenticated: false,
  hasBusiness: false,
  isOwner: false,
  isCashier: false,
  loading: true,
  refreshSession: async () => {},
  clearSession: () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    authenticated: false,
    hasBusiness: false,
    isOwner: false,
    isCashier: false,
    loading: true,
  });

  const refreshSession = useCallback(async (retryCount = 0, isInitialLoad = false) => {
    try {
      // Check if token exists
      if (typeof window === 'undefined') {
        setSession(prev => ({ ...prev, loading: false }));
        return;
      }

      let token: string | null = null;
      
      // In Tauri, check localStorage first, then cookies as fallback
      if (isNative()) {
        token = localStorage.getItem('kapok-session-token');
        // If not in localStorage, check cookies as fallback
        if (!token) {
          const cookies = document.cookie.split(';');
          const sessionCookie = cookies.find(c => c.trim().startsWith('kapok-session-token='));
          token = sessionCookie?.split('=')[1]?.trim() || null;
        }
        console.log('[SessionProvider] Token found:', token ? 'YES' : 'NO', 'isNative:', true);
      } else {
        // In web mode, check cookies first, then localStorage as fallback
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies.find(c => c.trim().startsWith('kapok-session-token='));
        token = sessionCookie?.split('=')[1]?.trim() || null;
        // If not in cookies, check localStorage as fallback
        if (!token && typeof window !== 'undefined' && window.localStorage) {
          token = localStorage.getItem('kapok-session-token');
        }
        console.log('[SessionProvider] Token found:', token ? 'YES' : 'NO', 'isNative:', false);
      }

      if (!token) {
        console.warn('[SessionProvider] No token found, setting unauthenticated');
        setSession({
          authenticated: false,
          hasBusiness: false,
          isOwner: false,
          isCashier: false,
          loading: false,
        });
        return;
      }

      // Verify session with retry logic for production Tauri builds
      let result;
      const maxRetries = isNative() ? 3 : 1; // More retries in Tauri production
      const retryDelay = 300; // 300ms between retries

      // Only set loading on initial load, not during periodic refreshes
      if (isInitialLoad) {
        setSession(prev => ({ ...prev, loading: true }));
      }

      try {
        if (isNative()) {
          // Pass retry options for production Tauri builds
          result = await checkUserHasBusinessClient({ retries: 3, retryDelay: 300 });
        } else {
          result = await checkUserHasBusiness();
        }
      } catch (checkError) {
        // If check fails and we have a token, retry (might be database initialization delay)
        if (retryCount < maxRetries && token) {
          console.warn(`[SessionProvider] Session check failed, retrying (${retryCount + 1}/${maxRetries}):`, checkError);
          // Don't change authenticated state during retry - preserve current state
          setTimeout(() => {
            refreshSession(retryCount + 1, false);
          }, retryDelay);
          return; // Don't update session state yet, wait for retry
        }
        // If we have a token but max retries reached, preserve authenticated state
        if (token && retryCount >= maxRetries) {
          console.warn('[SessionProvider] Max retries reached but token exists, preserving authenticated state');
          setSession(prev => ({ ...prev, loading: false }));
          return; // Don't update authenticated state - keep it as is
        }
        throw checkError; // Re-throw if no token or other error
      }

      // If we have a token but result says not authenticated, and we haven't exhausted retries, try again
      if (token && !result.authenticated && retryCount < maxRetries && isNative()) {
        console.warn(`[SessionProvider] Token exists but check returned unauthenticated, retrying (${retryCount + 1}/${maxRetries})`);
        // Don't change authenticated state during retry - preserve current state
        setTimeout(() => {
          refreshSession(retryCount + 1, false);
        }, retryDelay);
        return; // Don't update session state yet, wait for retry
      }

      const pathname = typeof window !== 'undefined' ? window.location.pathname : 'server';
      console.log(`[SessionProvider] Session check result (${pathname}):`, {
        authenticated: result.authenticated,
        hasBusiness: result.hasBusiness,
        isOwner: result.isOwner,
        isCashier: result.isCashier,
        retryCount,
        isInitialLoad,
      });
      
      // If we have a token but result says not authenticated (after retries), don't update state
      // This prevents redirects during navigation when verification fails temporarily
      // Only update state if verification is successful OR if there's no token
      if (token && !result.authenticated && isNative()) {
        console.warn('[SessionProvider] Token exists but verification failed after retries. Preserving current state to avoid redirect.');
        // Don't update state - preserve current authenticated state
        setSession(prev => ({ ...prev, loading: false }));
        return;
      }
      
      // If authenticated is true but hasBusiness is false (temporary verification failure),
      // preserve previous hasBusiness and isOwner states to avoid redirect during navigation
      setSession(prev => {
        const shouldPreserveBusiness = token && result.authenticated && !result.hasBusiness && isNative() && prev.hasBusiness;
        const shouldPreserveOwner = token && result.authenticated && shouldPreserveBusiness && !result.isOwner && isNative() && prev.isOwner;
        
        const newState = {
          authenticated: result.authenticated,
          hasBusiness: shouldPreserveBusiness ? prev.hasBusiness : (result.hasBusiness || false),
          isOwner: shouldPreserveOwner ? prev.isOwner : (result.isOwner || false),
          isCashier: result.isCashier || false,
          businessId: result.businessId || prev.businessId,
          branchId: result.branchId || prev.branchId,
          role: result.role || prev.role,
          loading: false,
        };
        
        // Log si el estado cambió de forma significativa
        if (prev.authenticated !== newState.authenticated || 
            prev.hasBusiness !== newState.hasBusiness || 
            prev.isOwner !== newState.isOwner) {
          const pathname = typeof window !== 'undefined' ? window.location.pathname : 'server';
          console.warn(`[SessionProvider] Session state changed (${pathname}):`, {
            previous: {
              authenticated: prev.authenticated,
              hasBusiness: prev.hasBusiness,
              isOwner: prev.isOwner,
            },
            current: {
              authenticated: newState.authenticated,
              hasBusiness: newState.hasBusiness,
              isOwner: newState.isOwner,
            },
            preserved: {
              business: shouldPreserveBusiness,
              owner: shouldPreserveOwner,
            },
          });
        }
        
        return newState;
      });
    } catch (error) {
      console.error('[SessionProvider] Error refreshing session:', error);
      // Only set authenticated to false if we've exhausted retries or have no token
      const hasToken = (typeof window !== 'undefined' && (
        localStorage.getItem('kapok-session-token') ||
        document.cookie.includes('kapok-session-token=')
      ));
      
      // If we have a token but hit max retries, set loading to false but don't change authenticated state
      // This allows the guard to wait a bit before redirecting, giving the periodic refresh a chance to succeed
      if (hasToken && retryCount >= (isNative() ? 3 : 1)) {
        console.warn('[SessionProvider] Max retries reached but token exists, setting loading to false');
        // Set loading to false but preserve authenticated state - periodic refresh will try again
        setSession(prev => ({ ...prev, loading: false }));
        return;
      }

      setSession({
        authenticated: false,
        hasBusiness: false,
        isOwner: false,
        isCashier: false,
        loading: false,
      });
    }
  }, []);

  const clearSession = useCallback(() => {
    setSession({
      authenticated: false,
      hasBusiness: false,
      isOwner: false,
      isCashier: false,
      loading: false,
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Initial session check with retry support
    refreshSession(0, true);

    // Listen for custom storage event (for same-tab updates in Tauri) - only on login
    const handleCustomStorageChange = () => {
      if (isMounted) {
        // Only refresh if we don't have authenticated state yet
        refreshSession(0, false);
      }
    };

    window.addEventListener('kapok-session-update', handleCustomStorageChange);

    // Refresh session periodically (every 10 minutes) - less aggressive
    const interval = setInterval(() => {
      if (isMounted) {
        // Only refresh if we have a token
        const hasToken = typeof window !== 'undefined' && (
          localStorage.getItem('kapok-session-token') ||
          document.cookie.includes('kapok-session-token=')
        );
        if (hasToken) {
          refreshSession(0, false);
        }
      }
    }, 10 * 60 * 1000); // 10 minutes instead of 5

    return () => {
      isMounted = false;
      window.removeEventListener('kapok-session-update', handleCustomStorageChange);
      clearInterval(interval);
    };
  }, [refreshSession]);

  const value: SessionContextType = {
    ...session,
    refreshSession,
    clearSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
