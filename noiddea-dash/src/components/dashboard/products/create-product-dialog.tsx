'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateProduct, useSelectedBranch } from '@/hooks';
import { useState } from 'react';
import { CreateProductForm } from './create-product-form';
import { HugeiconsIcon } from "@hugeicons/react";
import { BuildingIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const { selectedBranch, isLoading: branchLoading } = useSelectedBranch();
  const createProductMutation = useCreateProduct();

  const handleSuccess = () => {
    setOpen(false);
  };

  // No permitir crear productos si no hay branch seleccionado
  if (!selectedBranch && !branchLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Nuevo producto</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sucursal requerida</DialogTitle>
            <DialogDescription>
              Debes seleccionar una sucursal antes de crear productos
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <HugeiconsIcon icon={BuildingIcon} className='size-4' strokeWidth={2} />
            <AlertDescription>
              Por favor, selecciona una sucursal desde el menú lateral para continuar.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={branchLoading || !selectedBranch} size="sm">
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Nuevo producto
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-3xl max-w-3xl min-h-[700px] max-h-[90vh] overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
          <DialogDescription>
            Producto para la sucursal {selectedBranch?.name}
          </DialogDescription>
        </DialogHeader>
        {selectedBranch && (
          <CreateProductForm
            branchId={selectedBranch.id}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
            onSubmit={async (data) => {
              const result = await createProductMutation.mutateAsync(data);
              return result;
            }}
            isLoading={createProductMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
