"use client";

import { useQuery } from "@tanstack/react-query";
import { Sale } from "@/types";
import { queryKeys } from "@/lib/query-keys";
import { useMemo } from "react";
import { getSalesByBranch } from "@/services/sales";

export function useSalesQuery(branchId: string | null | undefined, options?: {
  date?: Date;
  limit?: number;
}) {
  const date = useMemo(() => {
    const d = options?.date || new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, [options?.date]);

  return useQuery({
    queryKey: branchId 
      ? [...queryKeys.sales.byBranch(branchId), date.toISOString(), options?.limit]
      : ["sales", "no-branch"],
    queryFn: async (): Promise<Sale[]> => {
      if (!branchId) {
        return [];
      }

      // Calcular fecha fin (al final del día)
      const dateTo = new Date(date);
      dateTo.setHours(23, 59, 59, 999);

      const result = await getSalesByBranch(branchId, date, dateTo);
      
      if (!result.success || !result.sales) {
        return [];
      }

      // Aplicar límite si se proporciona
      let sales = result.sales;
      if (options?.limit) {
        sales = sales.slice(0, options.limit);
      }

      return sales;
    },
    enabled: !!branchId,
    staleTime: 1 * 60 * 1000, // 1 minuto - las ventas cambian frecuentemente
    retry: 1,
  });
}
