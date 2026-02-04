'use client';

import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from './use-business';
import type { Branch } from '@/types';
import { getBranches } from '@/services';

export function useBranches() {
  const { business, isLoading: isLoadingBusiness, role } = useBusiness();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBranches = useCallback(async () => {
    // Si no hay negocio o aún está cargando, esperar
    if (isLoadingBusiness) {
      return;
    }

    if (!business) {
      setBranches([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Si el usuario es owner, obtener todas las sucursales del business
      if (role === 'owner') {
        const result = await getBranches();
        
        if (!result.success) {
          throw new Error(result.error || 'Error obteniendo sucursales');
        }

        // Filtrar por business_id por si acaso
        const filteredBranches = (result.branches || []).filter(
          (branch) => branch.business_id === business.id
        );

        setBranches(filteredBranches);
      } else {
        // Si no es owner, obtener solo las sucursales asignadas
        // (getBranches ya filtra por el usuario, pero cashiers solo tienen una)
        const result = await getBranches();
        
        if (!result.success) {
          throw new Error(result.error || 'Error obteniendo sucursales');
        }

        // Para cashiers, solo mostrar su sucursal asignada
        const filteredBranches = (result.branches || []).filter(
          (branch) => branch.business_id === business.id
        );

        setBranches(filteredBranches);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err as Error);
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  }, [business, isLoadingBusiness, role]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    isLoading: isLoadingBusiness || isLoading,
    error,
    refetch: fetchBranches,
  };
}
