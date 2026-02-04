'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSessions, closeSessionById, deleteSessionById } from '@/services/session-actions';
import { getUserSessionsClient, closeSessionByIdClient, deleteSessionByIdClient } from '@/lib/db/client-actions';
import { isNative } from '@/lib/native';
import { useUser } from '@/hooks/use-user';
import { queryKeys } from '@/lib/query-keys';
import type { UserSession } from '@/components/dashboard/sessions';
import { toast } from 'sonner';

/**
 * Hook para obtener sesiones usando TanStack Query
 */
export function useSessionsQuery(branchId?: string) {
  const { user } = useUser();
  
  return useQuery({
    queryKey: queryKeys.sessions.byBranch(branchId),
    queryFn: async (): Promise<UserSession[]> => {
      if (!user) {
        throw new Error('Debes estar autenticado');
      }

      const useClient = typeof window !== 'undefined' && isNative();
      const result = useClient
        ? await getUserSessionsClient(user.id, branchId)
        : await getUserSessions(branchId);

      if (!result.success) {
        throw new Error(result.error || 'Error obteniendo sesiones');
      }

      return (result.sessions || []) as UserSession[];
    },
    enabled: !!user,
  });
}

/**
 * Hook para cerrar una sesión
 */
export function useCloseSession() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const useClient = typeof window !== 'undefined' && isNative();
      const result = useClient
        ? await closeSessionByIdClient(sessionId)
        : await closeSessionById(sessionId);

      if (!result.success) {
        throw new Error(result.error || 'Error al cerrar la sesión');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Sesión cerrada correctamente');
      // Invalidar todas las queries de sesiones para actualizar en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.sessions.all,
        refetchType: 'all',
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cerrar la sesión');
    },
  });
}

/**
 * Hook para eliminar/archivar una sesión
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      console.log('[useDeleteSession] Iniciando eliminación de sesión:', sessionId);
      console.log('[useDeleteSession] Usuario:', user?.id);
      
      const useClient = typeof window !== 'undefined' && isNative();
      console.log('[useDeleteSession] Modo cliente:', useClient);
      
      const result = useClient
        ? await deleteSessionByIdClient(sessionId)
        : await deleteSessionById(sessionId);

      console.log('[useDeleteSession] Resultado de eliminación:', result);

      if (!result.success) {
        console.error('[useDeleteSession] Error en eliminación:', result.error);
        throw new Error(result.error || 'Error al archivar la sesión');
      }

      console.log('[useDeleteSession] Eliminación exitosa');
      return result;
    },
    onSuccess: () => {
      console.log('[useDeleteSession] onSuccess - Sesión archivada correctamente');
      toast.success('Sesión archivada correctamente');
      // Invalidar todas las queries de sesiones para actualizar en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.sessions.all,
        refetchType: 'all',
      });
      console.log('[useDeleteSession] Queries invalidadas');
    },
    onError: (error: Error) => {
      console.error('[useDeleteSession] onError:', error);
      toast.error(error.message || 'Error al archivar la sesión');
    },
  });
}
