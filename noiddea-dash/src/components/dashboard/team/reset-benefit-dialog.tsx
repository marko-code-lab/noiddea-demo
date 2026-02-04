'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { resetUserBenefit } from '@/services/user-actions';
import { resetUserBenefitClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { useUser } from '@/hooks';
import type { BusinessUser } from '@/hooks/use-business-users';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { HugeiconsIcon } from '@hugeicons/react';
import { DatabaseRestoreIcon } from '@hugeicons/core-free-icons';

interface ResetBenefitDialogProps {
  user: BusinessUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ResetBenefitDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: ResetBenefitDialogProps) {
  const [isResetting, setIsResetting] = useState(false);
  const { user: currentUser } = useUser();
  const queryClient = useQueryClient();

  const handleReset = async () => {
    if (!user) return;

    setIsResetting(true);

    try {
      let result;
      if (typeof window !== 'undefined' && isNative() && currentUser) {
        result = await resetUserBenefitClient(currentUser.id, user.id);
      } else {
        result = await resetUserBenefit(user.id);
      }

      if (result.success) {
        // Invalidar y refetchear la query de beneficio si hay branchId
        if (user.userId && user.branchId) {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryKeys.branchUsers.benefit(user.userId, user.branchId),
            }),
            queryClient.refetchQueries({
              queryKey: queryKeys.branchUsers.benefit(user.userId, user.branchId),
            }),
            // También invalidar la query de detalle del branch user
            queryClient.invalidateQueries({
              queryKey: queryKeys.branchUsers.detail(user.userId, user.branchId),
            }),
          ]);
        }
        
        toast.success('Beneficio restablecido correctamente');
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.error || 'Error al restablecer beneficio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al restablecer beneficio');
    } finally {
      setIsResetting(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={DatabaseRestoreIcon}/>
          </AlertDialogMedia>
          <AlertDialogTitle>Restablecer beneficio</AlertDialogTitle>
          <AlertDialogDescription>
            Verificar esta información para resguardar los derechos de los empleados
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isResetting}
          >
            Cancelar
          </Button>
          <Button onClick={handleReset} disabled={isResetting} variant={'destructive'}>
            {isResetting && <Spinner />}
            Restablecer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

