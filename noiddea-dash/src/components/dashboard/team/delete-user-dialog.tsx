'use client';

import { useState } from 'react';
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
import { deleteUser } from '@/services/user-actions';
import { deleteUserClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useUser } from '@/hooks';
import type { BusinessUser } from '@/hooks/use-business-users';

interface DeleteUserDialogProps {
  user: BusinessUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const roleLabels: Record<string, string> = {
  owner: 'Propietario',
  cashier: 'Cajero',
};

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user: currentUser } = useUser();

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);

    try {
      let result;
      if (typeof window !== 'undefined' && isNative() && currentUser) {
        result = await deleteUserClient(currentUser.id, user.id, user.level);
      } else {
        result = await deleteUser(user.id, user.level);
      }

      if (result.success) {
        toast.success('Usuario eliminado correctamente');
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al eliminar usuario');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de eliminar este usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El usuario perderá acceso al sistema asi como a todos sus datos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Spinner />}
            Eliminar Usuario
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

