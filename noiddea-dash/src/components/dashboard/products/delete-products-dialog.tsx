import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { deleteProducts } from '@/services/product-actions';
import { deleteProductsClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useUser } from '@/hooks';

interface DeleteProductsDialogProps {
  productIds: string[];
  productNames: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteProductsDialog({
  productIds,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProductsDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const handleDelete = async () => {
    if (productIds.length === 0) return;

    setDeleting(true);
    try {
      const result = typeof window !== 'undefined' && isNative() && user
        ? await deleteProductsClient(user.id, productIds)
        : await deleteProducts(productIds);

      if (result && result.success) {
        // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
        await queryClient.invalidateQueries({ 
          queryKey: queryKeys.products.all,
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        });
        await queryClient.invalidateQueries({ 
          queryKey: ['products', 'branch'],
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        });
        toast.success(
          `${result.deletedCount || productIds.length} producto(s) eliminado(s) correctamente`
        );
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result?.error || 'Error al eliminar productos');
      }
    } catch (error) {
      console.error('Error al eliminar productos:', error);
      toast.error('Error inesperado al eliminar productos');
    } finally {
      setDeleting(false);
    }
  };

  if (productIds.length === 0) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de eliminar {productIds.length} producto(s)?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer, se perderán todos los datos asociados a estos productos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={deleting}>
            {deleting && <Spinner />}
            Eliminar {productIds.length} producto(s)
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

