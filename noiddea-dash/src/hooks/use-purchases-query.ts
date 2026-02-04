'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPurchase,
  updatePurchaseStatus,
  receivePurchase,
  getPurchases,
  getBranchPurchases,
  getPurchaseById,
} from '@/services';
import {
  getPurchasesClient,
  getBranchPurchasesClient,
  receivePurchaseClient,
  createPurchaseClient,
  updatePurchaseStatusClient,
  getPurchaseByIdClient,
} from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useUser } from '@/hooks/use-user';
import { queryKeys } from '@/lib/query-keys';

/**
 * Hook para obtener compras usando TanStack Query
 */
export function usePurchasesQuery(businessId?: string, branchId?: string) {
  const { user } = useUser();
  
  return useQuery({
    queryKey: businessId
      ? queryKeys.purchases.byBusiness(businessId)
      : branchId
        ? queryKeys.purchases.byBranch(branchId)
        : queryKeys.purchases.all,
    queryFn: async () => {
      if (!businessId && !branchId) {
        throw new Error('Business ID o Branch ID requerido');
      }

      // Usar función client si estamos en modo Electron
      const useClient = typeof window !== 'undefined' && isNative() && user;
      
      let result;
      if (branchId) {
        result = useClient
          ? await getBranchPurchasesClient(user.id, branchId)
          : await getBranchPurchases(branchId);
      } else if (businessId) {
        result = useClient
          ? await getPurchasesClient(user.id, businessId)
          : await getPurchases(businessId);
      } else {
        throw new Error('Business ID o Branch ID requerido');
      }

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error obteniendo compras');
      }

      return result.data;
    },
    enabled: !!(businessId || branchId) && !!user,
  });
}

/**
 * Hook para obtener una compra específica
 */
export function usePurchaseQuery(purchaseId?: string) {
  const { user } = useUser();
  
  return useQuery({
    queryKey: queryKeys.purchases.detail(purchaseId!),
    queryFn: async () => {
      if (!purchaseId) {
        throw new Error('Purchase ID is required');
      }

      const useClient = typeof window !== 'undefined' && isNative() && user;
      const result = useClient
        ? await getPurchaseByIdClient(user.id, purchaseId)
        : await getPurchaseById(purchaseId);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error obteniendo compra');
      }

      return result.data;
    },
    enabled: !!purchaseId && !!user,
  });
}

/**
 * Hook para crear compra
 */
export function useCreatePurchase() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (purchase: any) => {
      if (typeof window !== 'undefined' && isNative() && user) {
        return await createPurchaseClient(user.id, purchase);
      }
      return await createPurchase(purchase);
    },
    onSuccess: () => {
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.purchases.all,
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
    },
  });
}

/**
 * Hook para actualizar estado de compra
 */
export function useUpdatePurchaseStatus() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({
      purchaseId,
      status,
      notes,
    }: {
      purchaseId: string;
      status: string;
      notes?: string;
    }) => {
      if (typeof window !== 'undefined' && isNative() && user) {
        return await updatePurchaseStatusClient(user.id, purchaseId, status, notes);
      }
      return await updatePurchaseStatus(purchaseId, status, notes);
    },
    onSuccess: () => {
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.purchases.all,
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
    },
  });
}

/**
 * Hook para recibir compra
 */
export function useReceivePurchase() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (purchaseId: string) => {
      console.log('[useReceivePurchase] Iniciando recepción de pedido:', purchaseId);
      // Usar función client si estamos en modo Electron
      if (typeof window !== 'undefined' && isNative() && user) {
        const result = await receivePurchaseClient(user.id, purchaseId);
        console.log('[useReceivePurchase] Resultado de receivePurchaseClient:', result);
        return result;
      }
      const result = await receivePurchase(purchaseId);
      console.log('[useReceivePurchase] Resultado de receivePurchase:', result);
      return result;
    },
    onSuccess: (result) => {
      console.log('[useReceivePurchase] onSuccess llamado con resultado:', result);
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      // Esto actualiza tanto las compras como los productos (stock) automáticamente
      Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.purchases.all,
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        }),
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.products.all,
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        }),
        queryClient.invalidateQueries({ 
          queryKey: ["products"],
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        }),
        // Invalidar también todas las queries de productos por branch para actualizar stock
        queryClient.invalidateQueries({ 
          predicate: (query) => {
            // Invalidar todas las queries que empiezan con 'products'
            return Array.isArray(query.queryKey) && query.queryKey[0] === 'products';
          },
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        }),
      ]).catch((error) => {
        console.error('[useReceivePurchase] Error invalidando queries:', error);
      }); // No bloquear si falla alguna invalidación
    },
    onError: (error) => {
      console.error('[useReceivePurchase] onError llamado:', error);
    },
  });
}

/**
 * Hook para estadísticas de compras
 */
export function usePurchaseStatsQuery(businessId?: string) {
  return useQuery({
    queryKey: queryKeys.purchases.stats(businessId!),
    queryFn: async () => {
      if (!businessId) {
        throw new Error('Business ID is required');
      }

      const result = await getPurchases(businessId);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error obteniendo compras');
      }

      const purchases = result.data || [];

      return {
        total: purchases.length,
        pending: purchases.filter((p: any) => p.status === 'pending').length,
        approved: purchases.filter((p: any) => p.status === 'approved').length,
        received: purchases.filter((p: any) => p.status === 'received').length,
        cancelled: purchases.filter((p: any) => p.status === 'cancelled').length,
        totalAmount: purchases.reduce((sum: number, p: any) => sum + (p.total || 0), 0),
      };
    },
    enabled: !!businessId,
  });
}
