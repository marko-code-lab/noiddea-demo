
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import type { ProductWithPresentations } from '@/types';
import { useDeleteProduct } from '@/hooks';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';

interface DeleteProductDialogProps {
  product: ProductWithPresentations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteProductDialog({
  product,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProductDialogProps) {
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = async () => {
    if (!product) return;

    try {
      const result = await deleteProductMutation.mutateAsync(product.id);
      if (result?.success) {
        toast.success('Producto eliminado correctamente');
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result?.error || 'Error al eliminar producto');
      }
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>  
        <AlertDialogHeader>
          <AlertDialogTitle>Esta seguro de querer eliminar este producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y se eliminarán todas las presentaciones asociadas a este producto.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteProductMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
          >
            {deleteProductMutation.isPending && <Spinner className="mr-2" />}
            Eliminar Producto
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

