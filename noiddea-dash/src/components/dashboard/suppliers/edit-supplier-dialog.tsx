'use client';

import { useState, useEffect, useRef } from 'react';
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
import { useUpdateSupplier } from '@/hooks/use-suppliers-query';
import type { Supplier } from '@/types';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput, InputGroupButton } from '@/components/ui/input-group';
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface EditSupplierDialogProps {
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditSupplierDialog({
  supplier,
  open,
  onOpenChange,
  onSuccess,
}: EditSupplierDialogProps) {
  const updateSupplierMutation = useUpdateSupplier();
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    phone: '',
    address: '',
  });
  const previousSupplierIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Actualizar form data solo cuando:
  // 1. El diálogo se abre (open cambia a true)
  // 2. El supplier cambia Y el diálogo está abierto Y es un supplier diferente
  useEffect(() => {
    if (open && supplier) {
      const supplierId = supplier.id;
      
      // Solo actualizar si es un supplier diferente o si es la primera vez que se abre
      if (supplierId !== previousSupplierIdRef.current || !isInitializedRef.current) {
        setFormData({
          name: supplier.name || '',
          ruc: supplier.ruc || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
        });
        previousSupplierIdRef.current = supplierId;
        isInitializedRef.current = true;
      }
    } else if (!open) {
      // Reset cuando se cierra el diálogo
      isInitializedRef.current = false;
      previousSupplierIdRef.current = null;
    }
  }, [open, supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplier) return;

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

    try {
      const result = await updateSupplierMutation.mutateAsync({
        supplierId: supplier.id,
        updates: {
          name: formData.name.trim(),
          ruc: formData.ruc.trim() || null,
          phone: formData.phone.trim() || null,
          address: formData.address.trim() || null,
        },
      });

      if (result?.success) {
        toast.success('Proveedor actualizado exitosamente');
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result?.error || 'Error al actualizar proveedor');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Error inesperado al actualizar proveedor');
    }
  };

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar proveedor</DialogTitle>
          <DialogDescription>
            Modifica la información del proveedor
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre *</FieldLabel>
              <Input
                type="text"
                placeholder="Nombre del proveedor"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={updateSupplierMutation.isPending}
              />
            </Field>
            <Field>
              <FieldLabel>RUC</FieldLabel>
              <Input
                type="text"
                placeholder="RUC del proveedor (11 caracteres)"
                value={formData.ruc}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Solo números
                  if (value.length <= 11) {
                    setFormData({ ...formData, ruc: value });
                  }
                }}
                maxLength={11}
                disabled={updateSupplierMutation.isPending}
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
                  disabled={updateSupplierMutation.isPending}
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
                placeholder="Dirección del proveedor"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={updateSupplierMutation.isPending}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className='mt-4'>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateSupplierMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateSupplierMutation.isPending || !formData.name.trim()}
            >
              {updateSupplierMutation.isPending && <Spinner className="mr-2" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
