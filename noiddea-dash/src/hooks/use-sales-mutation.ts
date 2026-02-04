"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "@/services/sales";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

interface CreateSaleInput {
  branchId: string;
  userId: string;
  customer?: string;
  paymentMethod: "cash" | "card" | "transfer" | "digital_wallet";
  items: Array<{
    productId: string;
    productPresentationId: string;
    quantity: number;
    unitPrice: number;
    bonification: number;
    presentationUnits: number;
  }>;
}

export function useCreateSaleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSaleInput) => {
      const result = await createSale(input);
      if (!result.success) {
        throw new Error(result.error || "No se pudo crear la venta");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      Promise.all([
        // Invalidar ventas por branch (usar patrón para cubrir cualquier branchId relacionado)
        queryClient.invalidateQueries({
          queryKey: ['sales', 'branch'],
          refetchType: 'active',
        }),
        // Refetchear inmediatamente todas las queries de ventas de sesión para este usuario
        // Esto cubre cualquier branchId (incluyendo conversiones de business_id a branch_id)
        queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              Array.isArray(key) &&
              key.length >= 3 &&
              key[0] === 'sessions' &&
              key[1] === 'sales' &&
              key[2] === variables.userId
            );
          },
        }),
        // También invalidar por patrón más específico
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.sales(variables.userId, variables.branchId),
          refetchType: 'active',
        }),
        // Invalidar productos para actualizar stock
        queryClient.invalidateQueries({
          queryKey: ['products', 'branch'],
          refetchType: 'active',
        }),
        // Invalidar y refetchear beneficios del usuario para actualización inmediata
        queryClient.invalidateQueries({
          queryKey: queryKeys.branchUsers.benefit(variables.userId, variables.branchId),
        }),
        queryClient.refetchQueries({
          queryKey: queryKeys.branchUsers.benefit(variables.userId, variables.branchId),
        }),
        // Invalidar la query del usuario para actualizar el benefit en el objeto user
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.user,
        }),
        queryClient.refetchQueries({
          queryKey: queryKeys.auth.user,
        }),
      ]).catch(console.error); // No bloquear si falla alguna invalidación
      
      toast.success("Venta creada exitosamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la venta");
    },
  });
}

