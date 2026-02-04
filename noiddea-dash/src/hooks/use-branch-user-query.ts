"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getDatabaseClient } from "@/lib/db/client";
import { queryOne } from "@/lib/database";
import { isNative } from "@/lib/native";

interface BranchUserData {
  role: string;
  benefit: number | null;
}

export function useBranchUserQuery(userId: string | null | undefined, branchId: string | null | undefined) {
  return useQuery({
    queryKey: userId && branchId 
      ? queryKeys.branchUsers.detail(userId, branchId)
      : ["branchUser", "no-ids"],
    queryFn: async (): Promise<BranchUserData | null> => {
      if (!userId || !branchId) {
        return null;
      }

      const db = getDatabaseClient();
      const data = await db.selectOne<BranchUserData>(
        `SELECT role, benefit FROM branches_users WHERE user_id = ? AND branch_id = ? AND is_active = 1 LIMIT 1`,
        [userId, branchId]
      );

      return data || null;
    },
    enabled: !!userId && !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
}

export function useBranchUserBenefitQuery(userId: string | null | undefined, branchId: string | null | undefined) {
  return useQuery({
    queryKey: userId && branchId 
      ? queryKeys.branchUsers.benefit(userId, branchId)
      : ["branchUserBenefit", "no-ids"],
    queryFn: async (): Promise<number | null> => {
      if (!userId || !branchId) {
        return null;
      }

      // En modo Electron, usar queryOne directamente (IPC)
      // En servidor, usar getDatabaseClient
      let data: { benefit: number | null } | null = null;
      
      if (typeof window !== 'undefined' && isNative()) {
        data = await queryOne<{ benefit: number | null }>(
          `SELECT benefit FROM branches_users WHERE user_id = ? AND branch_id = ? AND is_active = 1 LIMIT 1`,
          [userId, branchId]
        );
      } else {
        const db = getDatabaseClient();
        data = await db.selectOne<{ benefit: number | null }>(
          `SELECT benefit FROM branches_users WHERE user_id = ? AND branch_id = ? AND is_active = 1 LIMIT 1`,
          [userId, branchId]
        );
      }

      return data?.benefit ?? null;
    },
    enabled: !!userId && !!branchId,
    staleTime: 0, // Siempre considerar los datos como stale para que se refetchee cuando se invalida
    refetchOnMount: true, // Refetchear cuando el componente se monta
    retry: 1,
  });
}
