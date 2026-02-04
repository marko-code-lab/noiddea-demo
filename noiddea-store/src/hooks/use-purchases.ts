'use client';

import { useState, useEffect } from 'react';
import { getDatabaseClient } from '@/lib/db/client';
import type { PurchaseWithItems } from '@/types';
import { checkUserHasBusiness } from '@/services/user-actions';

export function usePurchases(businessId?: string, branchId?: string) {
  const [purchases, setPurchases] = useState<PurchaseWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!businessId && !branchId) {
        // Si no se proporciona, obtenerlo del usuario actual
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

        let sql = `
          SELECT 
            p.*,
            s.name as supplier_name,
            s.phone as supplier_phone,
            s.ruc as supplier_ruc,
            b.name as branch_name,
            u1.name as created_by_name,
            u1.email as created_by_email,
            u2.name as approved_by_name,
            u2.email as approved_by_email
          FROM purchases p
          LEFT JOIN suppliers s ON s.id = p.supplier_id
          LEFT JOIN branches b ON b.id = p.branch_id
          LEFT JOIN users u1 ON u1.id = p.created_by
          LEFT JOIN users u2 ON u2.id = p.approved_by
          WHERE 1=1
        `;
        const params: any[] = [];

        if (businessId) {
          sql += ` AND p.business_id = ?`;
          params.push(businessId);
        }
        if (branchId) {
          sql += ` AND p.branch_id = ?`;
          params.push(branchId);
        }

        sql += ` ORDER BY p.created_at DESC`;

        const purchasesData = await db.select<any>(sql, params);

        // Formatear los datos para que coincidan con PurchaseWithItems
        const formattedPurchases: PurchaseWithItems[] = purchasesData.map((p: any) => ({
          ...p,
          supplier: p.supplier_name ? {
            id: p.supplier_id,
            name: p.supplier_name,
            phone: p.supplier_phone,
            ruc: p.supplier_ruc,
          } : undefined,
          branch: p.branch_name ? {
            id: p.branch_id,
            name: p.branch_name,
          } : undefined,
          created_by_user: p.created_by_name ? {
            id: p.created_by,
            name: p.created_by_name,
            email: p.created_by_email,
          } : undefined,
          approved_by_user: p.approved_by_name ? {
            id: p.approved_by,
            name: p.approved_by_name,
            email: p.approved_by_email,
          } : undefined,
        }));

        setPurchases(formattedPurchases);
        setError(null);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();

    // Refrescar periódicamente
    const interval = setInterval(() => {
      fetchPurchases();
    }, 30000);

    return () => clearInterval(interval);
  }, [businessId, branchId]);

  return { purchases, loading, error, refetch: () => {} };
}

export function usePurchase(purchaseId?: string) {
  const [purchase, setPurchase] = useState<PurchaseWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!purchaseId) {
      setLoading(false);
      return;
    }

    const fetchPurchase = async () => {
      try {
        setLoading(true);

        // Similar a usePurchases pero para un solo purchase
        // Implementación simplificada por ahora
        setPurchase(null);
        setError(null);
      } catch (err) {
        console.error('Error fetching purchase:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [purchaseId]);

  return { purchase, loading, error };
}

export function usePurchaseStats(businessId?: string) {
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    averagePurchaseValue: 0,
    pendingPurchases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const db = getDatabaseClient();

        // Obtener estadísticas de compras
        const statsData = await db.selectOne<{
          total_purchases: number;
          total_spent: number;
          average_value: number;
          pending_count: number;
        }>(
          `SELECT 
            COUNT(*) as total_purchases,
            COALESCE(SUM(total), 0) as total_spent,
            COALESCE(AVG(total), 0) as average_value,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count
           FROM purchases WHERE business_id = ?`,
          [businessId]
        );

        if (statsData) {
          setStats({
            totalPurchases: statsData.total_purchases || 0,
            totalSpent: statsData.total_spent || 0,
            averagePurchaseValue: statsData.average_value || 0,
            pendingPurchases: statsData.pending_count || 0,
          });
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching purchase stats:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [businessId]);

  return { stats, loading, error };
}
