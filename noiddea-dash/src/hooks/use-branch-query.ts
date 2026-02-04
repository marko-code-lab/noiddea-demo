"use client";

import { useQuery } from "@tanstack/react-query";
import { Branch, Business } from "@/types";
import { queryKeys } from "@/lib/query-keys";
import { getDatabaseClient } from "@/lib/db/client";
import { getCurrentUser } from "@/services/user-actions";
import { getCurrentUserClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";

/**
 * Convierte un Business a Branch para mantener compatibilidad
 * Ahora Business y Branch son prácticamente lo mismo
 */
function businessToBranch(business: Business): Branch {
  return {
    id: business.id,
    business_id: business.id,
    name: business.name,
    location: business.description || business.name,
    phone: null,
    created_at: business.created_at,
  };
}

export function useBranchQuery() {
  return useQuery({
    queryKey: queryKeys.branches.all,
    queryFn: async (): Promise<{ branch: Branch | null; branches: Branch[]; isOwner: boolean }> => {
      // Obtener usuario actual - usar la función correcta según el contexto
      let currentUser: { id: string; email?: string } | null = null;
      
      try {
        if (typeof window !== 'undefined' && isNative()) {
          // En modo Electron, usar la versión cliente
          const result = await getCurrentUserClient();
          currentUser = result.user ? { id: result.user.id, email: result.user.email } : null;
        } else {
          // En servidor, usar la versión de user-actions
          const result = await getCurrentUser();
          currentUser = result.user ? { id: result.user.id, email: result.user.email } : null;
        }
      } catch (error) {
        // Error silencioso - el usuario puede no estar autenticado
      }
      
      if (!currentUser) {
        return { branch: null, branches: [], isOwner: false };
      }

      const db = getDatabaseClient();

      // Ahora trabajamos directamente con Business
      // 1. PRIMERO verificar si es owner del negocio (businesses_users tiene prioridad)
      const businessUser = await db.selectOne<{
        business_id: string;
        role: string;
        business_name: string;
        business_description: string | null;
        business_tax_id: string;
        business_category: string | null;
        business_website: string | null;
        business_created_at: string;
      }>(
        `SELECT 
          bu.business_id, 
          bu.role,
          b.name as business_name,
          b.description as business_description,
          b.tax_id as business_tax_id,
          b.category as business_category,
          b.website as business_website,
          b.created_at as business_created_at
         FROM businesses_users bu
         INNER JOIN businesses b ON b.id = bu.business_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [currentUser.id]
      );

      if (businessUser && businessUser.role === "owner") {
        
        // Convertir Business a Branch para mantener compatibilidad
        const business: Business = {
          id: businessUser.business_id,
          name: businessUser.business_name,
          description: businessUser.business_description,
          tax_id: businessUser.business_tax_id,
          category: businessUser.business_category,
          website: businessUser.business_website,
          theme: null,
          created_at: businessUser.business_created_at,
        };
        
        const branch = businessToBranch(business);
        return {
          branches: [branch],
          branch: branch,
          isOwner: true,
        };
      }

      // 2. Si NO es owner, verificar si tiene acceso a través de branches_users (compatibilidad hacia atrás)
      const branchUser = await db.selectOne<{
        role: string;
        business_id: string;
        business_name: string;
        business_description: string | null;
        business_tax_id: string;
        business_category: string | null;
        business_website: string | null;
        business_created_at: string;
      }>(
        `SELECT 
          bu.role, 
          b.business_id,
          biz.name as business_name,
          biz.description as business_description,
          biz.tax_id as business_tax_id,
          biz.category as business_category,
          biz.website as business_website,
          biz.created_at as business_created_at
         FROM branches_users bu
         INNER JOIN branches b ON b.id = bu.branch_id
         INNER JOIN businesses biz ON biz.id = b.business_id
         WHERE bu.user_id = ? AND bu.is_active = 1 LIMIT 1`,
        [currentUser.id]
      );

      // Si tiene acceso a través de branch (cashier), usar el business asociado
      if (branchUser) {
        
        const business: Business = {
          id: branchUser.business_id,
          name: branchUser.business_name,
          description: branchUser.business_description,
          tax_id: branchUser.business_tax_id,
          category: branchUser.business_category,
          website: branchUser.business_website,
          theme: null,
          created_at: branchUser.business_created_at,
        };
        
        const branch = businessToBranch(business);
        return { branch: branch, branches: [branch], isOwner: false };
      }

      return { branch: null, branches: [], isOwner: false };
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
    // Evitar refetches innecesarios que causan recargas
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
