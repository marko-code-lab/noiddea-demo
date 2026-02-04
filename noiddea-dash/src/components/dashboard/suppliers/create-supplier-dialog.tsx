'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useCreateSupplier } from '@/hooks/use-suppliers-query';
import { useBranch } from '@/components/providers/branch-provider';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput, InputGroupButton } from '@/components/ui/input-group';
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface CreateSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateSupplierDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateSupplierDialogProps) {
  const createSupplierMutation = useCreateSupplier();
  const { branch } = useBranch();
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('El nombre del proveedor es requerido');
      return;
    }

    // Validar RUC: debe tener exactamente 11 caracteres si se proporciona
    if (formData.ruc.trim() && formData.ruc.trim().length !== 11) {
      toast.error('El RUC debe tener exactamente 11 caracteres');
      return;
    }

    // Validar teléfono: debe tener exactamente 9 caracteres si se proporciona
    if (formData.phone.trim() && formData.phone.trim().length !== 9) {
      toast.error('El número de celular debe tener exactamente 9 caracteres');
      return;
    }

    if (!branch?.id) {
      toast.error('No hay negocio seleccionado');
      return;
    }

    try {
      const supplierData = {
        business_id: branch.id,
        name: formData.name.trim(),
        ruc: formData.ruc.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        is_active: true,
      };

      const result = await createSupplierMutation.mutateAsync(supplierData);

      if (result?.success) {
        toast.success('Proveedor creado exitosamente');
        setFormData({ name: '', ruc: '', phone: '', address: '' });
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result?.error || 'Error al crear el proveedor');
      }
    } catch (error) {
      console.error('Error creating supplier:', error);
      toast.error('Error inesperado al crear proveedor');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({ name: '', ruc: '', phone: '', address: '' });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo proveedor</DialogTitle>
          <DialogDescription>
            Agrega un nuevo proveedor a tu negocio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre</FieldLabel>
              <Input
                type="text"
                placeholder="Acme Import"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={createSupplierMutation.isPending}
              />
            </Field>
            <Field>
              <FieldLabel>RUC</FieldLabel>
              <Input
                type="text"
                placeholder="00000000000"
                value={formData.ruc}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Solo números
                  if (value.length <= 11) {
                    setFormData({ ...formData, ruc: value });
                  }
                }}
                maxLength={11}
                disabled={createSupplierMutation.isPending}
              />
            </Field>
            <Field>
              <FieldLabel>Teléfono</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>+51</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput 
                  placeholder="000 000 000" 
                  type="tel" 
                  maxLength={9}
                  value={formData.phone} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Solo números
                    if (value.length <= 9) {
                      setFormData({ ...formData, phone: value });
                    }
                  }} 
                  disabled={createSupplierMutation.isPending}
                />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        variant="ghost"
                        aria-label="Info"
                        size="icon-xs"
                      >
                        <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>El número de teléfono del proveedor</p>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>Dirección</FieldLabel>
              <Input
                type="text"
                placeholder="Cercado de Lima"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={createSupplierMutation.isPending}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createSupplierMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createSupplierMutation.isPending || !formData.name.trim()}
            >
              {createSupplierMutation.isPending && <Spinner className="mr-2" />}
              Crear proveedor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
