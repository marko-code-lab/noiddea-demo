"use client";

import { useQuery } from "@tanstack/react-query";
import { Business } from "@/types";
import { queryKeys } from "@/lib/query-keys";
import { checkUserHasBusiness } from "@/services/user-actions";
import { getDatabaseClient } from "@/lib/db/client";

export function useBusinessQuery(businessId: string | null | undefined) {
  return useQuery({
    queryKey: businessId ? queryKeys.business.detail(businessId) : queryKeys.business.current,
    queryFn: async (): Promise<Business | null> => {
      if (!businessId) {
        // Si no hay businessId, intentar obtenerlo del usuario actual
        const userCheck = await checkUserHasBusiness();
        if (!userCheck.hasBusiness || !userCheck.businessId) {
          return null;
        }
        businessId = userCheck.businessId;
      }

      // Usar el cliente SQLite para obtener el negocio
      const db = getDatabaseClient();
      const business = await db.selectOne<Business>(
        `SELECT * FROM businesses WHERE id = ? LIMIT 1`,
        [businessId]
      );

      return business || null;
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutos - el business cambia poco
    retry: 1,
  });
}
