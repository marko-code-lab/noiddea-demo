"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveSession, getSessionSales } from "@/services/sessions";
import { getActiveSessionClient, getSessionSalesClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";
import { SaleWithItems, PaymentTotals } from "@/types";
import { queryKeys } from "@/lib/query-keys";

export function useSessionSalesQuery(
  userId: string | null | undefined,
  branchId: string | null | undefined
) {
  return useQuery({
    queryKey: userId && branchId
      ? queryKeys.sessions.sales(userId, branchId)
      : ["session-sales", "no-user-or-branch"],
    queryFn: async (): Promise<{
      sales: SaleWithItems[];
      sessionStartTime: string | null;
      sessionStats: {
        totalSales: number;
        totalBonus: number;
        paymentTotals: PaymentTotals | null;
      } | null;
    }> => {
      if (!userId || !branchId) {
        return {
          sales: [],
          sessionStartTime: null,
          sessionStats: null,
        };
      }

      // Obtener sesión activa
      // En modo Electron, usar la versión cliente que usa IPC
      let sessionResult;
      if (typeof window !== 'undefined' && isNative()) {
        sessionResult = await getActiveSessionClient(userId, branchId);
      } else {
        sessionResult = await getActiveSession(userId, branchId);
      }

      const session = sessionResult.data;
      if (!session) {
        return {
          sales: [],
          sessionStartTime: null,
          sessionStats: null,
        };
      }

      // Obtener ventas de la sesión
      // En modo Electron, usar la versión cliente que usa IPC
      let sessionSalesResult;
      if (typeof window !== 'undefined' && isNative()) {
        sessionSalesResult = await getSessionSalesClient(userId, branchId);
      } else {
        sessionSalesResult = await getSessionSales(userId, branchId);
      }

      const sessionSales = sessionSalesResult.data;
      const error = sessionSalesResult.error;

      if (error) {
        throw new Error(error);
      }

      return {
        sales: (sessionSales || []) as SaleWithItems[],
        sessionStartTime: session.created_at,
        sessionStats: {
          totalSales: session.total_sales || 0,
          totalBonus: session.total_bonus || 0,
          paymentTotals: (session.payment_totals as unknown as PaymentTotals) || null,
        },
      };
    },
    enabled: !!userId && !!branchId,
    staleTime: 0, // Siempre considerar los datos como stale para que se refetchee cuando se invalida
    refetchOnMount: true, // Refetchear cuando el componente se monta
    refetchOnWindowFocus: false, // No refetchear al cambiar de ventana
  });
}

