'use client';

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
import { useDeactivateSupplier } from '@/hooks/use-suppliers-query';
import type { Supplier } from '@/types';

interface DeleteSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteSupplierDialog({
  supplier,
  open,
  onOpenChange,
  onSuccess,
}: DeleteSupplierDialogProps) {
  const deactivateSupplierMutation = useDeactivateSupplier();

  const handleDelete = async () => {
    if (!supplier) return;

    try {
      const result = await deactivateSupplierMutation.mutateAsync(supplier.id);
      if (result?.success) {
        toast.success('Proveedor desactivado correctamente');
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result?.error || 'Error al desactivar proveedor');
      }
    } catch (error) {
      console.error('Error al desactivar proveedor:', error);
      toast.error('Error inesperado al desactivar proveedor');
    }
  };

  if (!supplier) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de desactivar este proveedor?</AlertDialogTitle>
          <AlertDialogDescription>
            El proveedor <strong>{supplier.name}</strong> será desactivado. Esta acción se puede revertir más tarde.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deactivateSupplierMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deactivateSupplierMutation.isPending}
          >
            {deactivateSupplierMutation.isPending && <Spinner className="mr-2" />}
            Desactivar Proveedor
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
