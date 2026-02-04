'use client';

import { useState, useEffect } from 'react';
import type { BranchUser } from '@/types';
import { getDatabaseClient } from '@/lib/db/client';

export interface BranchUserWithUser extends BranchUser {
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export function useBranchUsers(branchId?: string) {
  const [branchUsers, setBranchUsers] = useState<BranchUserWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!branchId) {
      setLoading(false);
      return;
    }

    const fetchBranchUsers = async () => {
      try {
        setLoading(true);
        const db = getDatabaseClient();

        // Obtener usuarios de la sucursal
        const users = await db.select<{
          id: string;
          branch_id: string;
          user_id: string;
          role: string;
          is_active: number;
          benefit: number | null;
          created_at: string;
          user_name: string;
          user_email: string;
          user_phone: string | null;
        }>(
          `SELECT 
            bu.id,
            bu.branch_id,
            bu.user_id,
            bu.role,
            bu.is_active,
            bu.benefit,
            bu.created_at,
            u.name as user_name,
            u.email as user_email,
            u.phone as user_phone
           FROM branches_users bu
           INNER JOIN users u ON u.id = bu.user_id
           WHERE bu.branch_id = ? AND bu.is_active = 1 AND bu.role = 'cashier'
           ORDER BY bu.created_at DESC`,
          [branchId]
        );

        const mappedUsers: BranchUserWithUser[] = users.map((row) => ({
          id: row.id,
          branch_id: row.branch_id,
          user_id: row.user_id,
          role: row.role as 'cashier',
          is_active: row.is_active,
          benefit: row.benefit,
          created_at: row.created_at,
          user: {
            id: row.user_id,
            name: row.user_name,
            email: row.user_email,
            phone: row.user_phone,
          },
        }));

        setBranchUsers(mappedUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching branch users:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchBranchUsers();

    // Nota: Ya no hay suscripciones en tiempo real, pero podemos refrescar periódicamente
    // o usar TanStack Query para invalidar cuando sea necesario
    const interval = setInterval(() => {
      fetchBranchUsers();
    }, 30000); // Refrescar cada 30 segundos

    return () => clearInterval(interval);
  }, [branchId]);

  return { branchUsers, loading, error };
}
