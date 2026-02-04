"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { queryKeys } from "@/lib/query-keys";
import { getCurrentUser } from "@/services/user-actions";
import { getCurrentUserClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";

export function useUserQuery() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async (): Promise<User | null> => {
      try {
        let userResult: { user: User | null; error?: string | null } | null = null;
        
        // En modo Electron, usar la versión cliente que usa IPC
        if (typeof window !== 'undefined' && isNative()) {
          const result = await getCurrentUserClient();
          userResult = result.user ? { user: result.user as User, error: null } : { user: null, error: result.error };
        } else {
          // En servidor, usar la versión de user-actions
          userResult = await getCurrentUser();
        }
        
        if (userResult?.user) {
          return userResult.user;
        }
        
        console.warn('[useUserQuery] No se pudo obtener usuario:', userResult?.error);
        return null;
      } catch (error) {
        console.error('[useUserQuery] Error obteniendo usuario:', error);
        return null;
      }
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutos - los datos de usuario cambian poco
    retry: 1,
  });
}
