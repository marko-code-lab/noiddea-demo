'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupplier, updateSupplier, getSuppliers, getSupplierById, deactivateSupplier } from '@/services';
import { getSuppliersClient, deactivateSupplierClient, updateSupplierClient, createSupplierClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useUser } from '@/hooks/use-user';
import { queryKeys } from '@/lib/query-keys';
import type { Supplier } from '@/types';

const shouldWaitForUser = () => typeof window !== 'undefined' && isNative();

/**
 * Hook para obtener proveedores usando TanStack Query
 */
export function useSuppliersQuery(businessId?: string) {
  const { user, isLoading: userLoading } = useUser();
  
  return useQuery({
    queryKey: businessId
      ? queryKeys.suppliers.byBusiness(businessId)
      : queryKeys.suppliers.all,
    queryFn: async () => {
      if (!businessId) throw new Error('Business ID requerido');

      const result = typeof window !== 'undefined' && isNative() && user?.id
        ? await getSuppliersClient(user.id, businessId)
        : await getSuppliers(businessId);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error obteniendo proveedores');
      }

      return result.data as Supplier[];
    },
    enabled: !!businessId && (!shouldWaitForUser() || (!userLoading && !!user?.id)),
    staleTime: 30 * 1000, // Considerar datos frescos por 30 segundos
    // Evitar refetches innecesarios que causan recargas
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook para obtener un proveedor específico
 */
export function useSupplierQuery(supplierId?: string) {
  return useQuery({
    queryKey: queryKeys.suppliers.detail(supplierId!),
    queryFn: async () => {
      if (!supplierId) {
        throw new Error('Supplier ID is required');
      }

      const result = await getSupplierById(supplierId);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Error obteniendo proveedor');
      }

      return result.data as Supplier;
    },
    enabled: !!supplierId,
  });
}

/**
 * Hook para crear proveedor
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (supplier: {
      business_id: string;
      name: string;
      ruc?: string | null;
      phone?: string | null;
      address?: string | null;
      is_active?: boolean;
    }) => {
      if (typeof window !== 'undefined' && isNative() && user?.id) {
        return await createSupplierClient(user.id, supplier);
      } else {
        // Convertir undefined a valores apropiados para cumplir con SupplierInsert
        const supplierData = {
          business_id: supplier.business_id,
          name: supplier.name,
          ruc: supplier.ruc ?? null,
          phone: supplier.phone ?? '',
          address: supplier.address ?? null,
          is_active: supplier.is_active !== undefined ? (supplier.is_active ? 1 : 0) : 1,
        };
        return await createSupplier(supplierData);
      }
    },
    onSuccess: (data, variables) => {
      // Actualizar el cache directamente con el nuevo proveedor
      if (variables.business_id && data?.data) {
        const queryKey = queryKeys.suppliers.byBusiness(variables.business_id);
        const newSupplier = data.data as Supplier;
        
        // Obtener los proveedores actuales del cache
        const currentSuppliers = queryClient.getQueryData<Supplier[]>(queryKey) || [];
        
        // Agregar el nuevo proveedor a la lista (ordenado por nombre)
        const updatedSuppliers = [...currentSuppliers, newSupplier].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        // Actualizar el cache directamente
        queryClient.setQueryData(queryKey, updatedSuppliers);
      }
      
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.suppliers.all,
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
      
      if (variables.business_id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.suppliers.byBusiness(variables.business_id),
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        });
      }
    },
  });
}

/**
 * Hook para actualizar proveedor
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({
      supplierId,
      updates,
    }: {
      supplierId: string;
      updates: {
        name?: string;
        ruc?: string | null;
        phone?: string | null;
        address?: string | null;
        is_active?: boolean;
      };
    }) => {
      if (typeof window !== 'undefined' && isNative() && user?.id) {
        return await updateSupplierClient(user.id, supplierId, updates);
      } else {
        // Convertir is_active de boolean a number para cumplir con SupplierUpdate
        const supplierUpdates = {
          ...updates,
          is_active: updates.is_active !== undefined ? (updates.is_active ? 1 : 0) : undefined,
          phone: updates.phone ?? undefined,
        };
        return await updateSupplier(supplierId, supplierUpdates);
      }
    },
    onSuccess: (data, variables) => {
      if (data?.success && data.data) {
        // Actualizar el cache directamente con el proveedor actualizado
        queryClient.setQueriesData<Supplier[]>(
          { queryKey: queryKeys.suppliers.all },
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((supplier) =>
              supplier.id === variables.supplierId
                ? (data.data as Supplier)
                : supplier
            ).sort((a, b) => a.name.localeCompare(b.name));
          }
        );
        
        // También actualizar queries por business
        queryClient.setQueriesData<Supplier[]>(
          { 
            predicate: (query) => 
              query.queryKey[0] === 'suppliers' && 
              Array.isArray(query.queryKey) &&
              query.queryKey.includes('business')
          },
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((supplier) =>
              supplier.id === variables.supplierId
                ? (data.data as Supplier)
                : supplier
            ).sort((a, b) => a.name.localeCompare(b.name));
          }
        );
      }
      
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.suppliers.all,
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
    },
  });
}

/**
 * Hook para desactivar proveedor
 */
export function useDeactivateSupplier() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (supplierId: string) => {
      return typeof window !== 'undefined' && isNative() && user?.id
        ? await deactivateSupplierClient(user.id, supplierId)
        : await deactivateSupplier(supplierId);
    },
    onSuccess: (data, supplierId) => {
      if (data?.success) {
        // Remover el proveedor del cache directamente de todas las queries de suppliers
        queryClient.setQueriesData<Supplier[]>(
          { queryKey: queryKeys.suppliers.all },
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter((supplier) => supplier.id !== supplierId);
          }
        );
        
        // También actualizar queries por business
        queryClient.setQueriesData<Supplier[]>(
          { 
            predicate: (query) => 
              query.queryKey[0] === 'suppliers' && 
              Array.isArray(query.queryKey) &&
              query.queryKey.includes('business')
          },
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter((supplier) => supplier.id !== supplierId);
          }
        );
        
        // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.suppliers.all,
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        });
      }
    },
  });
}
