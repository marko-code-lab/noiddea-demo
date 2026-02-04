'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBranch, getBranches } from '@/services';
import { createBranchClient, getBranchesClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useUser } from '@/hooks/use-user';
import { queryKeys } from '@/lib/query-keys';
import type { Branch } from '@/types';

/**
 * Hook para obtener sucursales usando TanStack Query
 */
export function useBranches(businessId?: string) {
  const { user } = useUser();
  
  return useQuery({
    queryKey: businessId
      ? queryKeys.branches.byBusiness(businessId)
      : queryKeys.branches.all,
    queryFn: async () => {
      const useClient = typeof window !== 'undefined' && isNative() && user;
      
      // Si se proporciona businessId, usarlo directamente
      if (businessId) {
        const result = useClient
          ? await getBranchesClient(user.id)
          : await getBranches();
        if (result.success && result.branches) {
          // Filtrar por businessId si es necesario (getBranches ya filtra por el negocio del usuario)
          return result.branches.filter(b => b.business_id === businessId);
        }
        return [];
      }

      // Si no se proporciona businessId, obtener todas las sucursales del usuario
      const result = useClient
        ? await getBranchesClient(user.id)
        : await getBranches();
      if (!result.success || !result.branches) {
        return [];
      }

      return result.branches as Branch[];
    },
    enabled: true,
  });
}

/**
 * Hook para obtener una sucursal específica
 */
export function useBranch(branchId?: string) {
  return useQuery({
    queryKey: branchId
      ? queryKeys.branches.detail(branchId)
      : ['branches', 'detail'],
    queryFn: async () => {
      if (!branchId) return null;

      const result = await getBranches();
      if (!result.success || !result.branches) {
        return null;
      }

      return result.branches.find(b => b.id === branchId) || null;
    },
    enabled: !!branchId,
  });
}

/**
 * Hook para crear sucursal
 */
export function useCreateBranch() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (data: Parameters<typeof createBranch>[0]) => {
      if (typeof window !== 'undefined' && isNative() && user) {
        return await createBranchClient(user.id, data);
      }
      return await createBranch(data);
    },
    onSuccess: () => {
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.branches.all,
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
    },
  });
}
