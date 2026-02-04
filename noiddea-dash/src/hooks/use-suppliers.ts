'use client';

import { useState, useEffect } from 'react';
import { getDatabaseClient } from '@/lib/db/client';
import type { Supplier } from '@/types';
import { checkUserHasBusiness } from '@/services/user-actions';

export function useSuppliers(businessId?: string) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (!businessId) {
        // Si no se proporciona businessId, obtenerlo del usuario actual
        const userCheck = await checkUserHasBusiness();
        if (!userCheck.hasBusiness || !userCheck.businessId) {
          setLoading(false);
          return;
        }
        businessId = userCheck.businessId;
      }

      try {
        setLoading(true);
        const db = getDatabaseClient();

        const suppliersData = await db.select<Supplier>(
          `SELECT * FROM suppliers WHERE business_id = ? AND is_active = 1 ORDER BY name ASC`,
          [businessId]
        );

        setSuppliers(suppliersData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();

    // Refrescar periódicamente
    const interval = setInterval(() => {
      fetchSuppliers();
    }, 30000); // Refrescar cada 30 segundos

    return () => clearInterval(interval);
  }, [businessId]);

  return { suppliers, loading, error, refetch: () => {} };
}

export function useSupplier(supplierId?: string) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supplierId) {
      setLoading(false);
      return;
    }

    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const db = getDatabaseClient();

        const supplierData = await db.selectOne<Supplier>(
          `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
          [supplierId]
        );

        setSupplier(supplierData || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching supplier:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();

    // Refrescar periódicamente
    const interval = setInterval(() => {
      fetchSupplier();
    }, 30000);

    return () => clearInterval(interval);
  }, [supplierId]);

  return { supplier, loading, error };
}
