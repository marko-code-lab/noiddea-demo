'use client';

import { useMutation } from '@tanstack/react-query';
import { useUser } from '@/hooks/use-user';
import { useBranch } from '@/components/providers/branch-provider';
import { isNative } from '@/lib/native';
import { getPurchaseById } from '@/services';
import { getPurchaseByIdClient } from '@/lib/db/client-actions';
import { generateAndDownloadPurchasePdf } from '@/lib/download-purchase-pdf';
import { toast } from 'sonner';

export function useDownloadPurchasePdf() {
  const { user } = useUser();
  const { branch } = useBranch();

  const mutation = useMutation({
    mutationFn: async (purchaseId: string) => {
      const useClient =
        typeof window !== 'undefined' && isNative() && user != null;
      const result = useClient
        ? await getPurchaseByIdClient(user!.id, purchaseId)
        : await getPurchaseById(purchaseId);

      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Error al obtener el pedido');
      }

      generateAndDownloadPurchasePdf(result.data, branch?.name ?? undefined);
    },
    onSuccess: () => {
      toast.success('PDF descargado correctamente');
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Error al descargar PDF';
      toast.error(msg);
    },
  });

  return {
    downloadPurchasePdf: mutation.mutateAsync,
    isDownloading: mutation.isPending,
  };
}
