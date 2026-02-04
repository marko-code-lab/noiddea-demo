
import {
  activatePresentation,
  deletePresentation,
  updatePresentation,
} from '@/services/presentation-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { ProductPresentation } from '@/types';
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalCircle01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface EditPresentationDialogProps {
  presentation: ProductPresentation;
}

export function EditPresentationDialog({
  presentation,
}: EditPresentationDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state - usando solo los campos disponibles en product_presentations
  const [variant, setVariant] = useState((presentation as any).variant || 'unidad');
  const [units, setUnits] = useState((presentation as any).units?.toString() || '1');
  const [price, setPrice] = useState(presentation.price?.toString() || '');
  const previousPresentationIdRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Reset form only when dialog opens or presentation actually changes
  useEffect(() => {
    if (open && presentation) {
      const presentationId = presentation.id;
      
      // Solo actualizar si es una presentación diferente o si es la primera vez que se abre
      if (presentationId !== previousPresentationIdRef.current || !isInitializedRef.current) {
        setVariant((presentation as any).variant || 'unidad');
        setUnits((presentation as any).units?.toString() || '1');
        setPrice(presentation.price?.toString() || '');
        previousPresentationIdRef.current = presentationId;
        isInitializedRef.current = true;
      }
    } else if (!open) {
      // Reset cuando se cierra el diálogo
      isInitializedRef.current = false;
      previousPresentationIdRef.current = null;
    }
  }, [open, presentation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!variant.trim()) {
      toast.error('La variante es requerida');
      return;
    }

    if (!units || parseInt(units) <= 0) {
      toast.error('Las unidades deben ser mayor a 0');
      return;
    }

    if (!price || parseFloat(price) < 0) {
      toast.error('El precio debe ser un número válido');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updatePresentation(presentation.id, {
        variant: variant.trim(),
        units: parseInt(units),
        price: parseFloat(price),
      });

      if (result.success) {
        // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
        await queryClient.invalidateQueries({ 
          predicate: (query) => {
            return query.queryKey[0] === 'products';
          },
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        });
        
        toast.success('Presentación actualizada exitosamente');
        setOpen(false);
      } else {
        toast.error(result.error || 'Error al actualizar presentación');
      }
    } catch (error) {
      console.error('Error updating presentation:', error);
      toast.error('Error al actualizar presentación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deletePresentation(presentation.id);

      if (result.success) {
        // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
        await queryClient.invalidateQueries({ 
          predicate: (query) => {
            return query.queryKey[0] === 'products';
          },
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        });
        
        toast.success('Presentación desactivada');
        setShowDeleteConfirm(false);
        setOpen(false);
      } else {
        toast.error(result.error || 'Error al desactivar presentación');
      }
    } catch (error) {
      console.error('Error deleting presentation:', error);
      toast.error('Error al desactivar presentación');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleActivate = async () => {
    setIsSubmitting(true);

    try {
      const result = await activatePresentation(presentation.id);

      if (result.success) {
        // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
        await queryClient.invalidateQueries({ 
          predicate: (query) => {
            return query.queryKey[0] === 'products';
          },
          refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
        });
        
        toast.success('Presentación activada');
        setOpen(false);
      } else {
        toast.error(result.error || 'Error al activar presentación');
      }
    } catch (error) {
      console.error('Error activating presentation:', error);
      toast.error('Error al activar presentación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon-sm'>
          <HugeiconsIcon icon={MoreVerticalCircle01Icon} strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Editar Presentación</DialogTitle>
          <DialogDescription>
            Actualiza la información de esta presentación
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='variant'>
                Variante <span className='text-destructive'>*</span>
              </Label>
              <Select
                value={variant}
                onValueChange={setVariant}
                disabled={isSubmitting || !presentation.is_active}
              >
                <SelectTrigger id='variant' className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='unidad'>Unidad</SelectItem>
                  <SelectItem value='pack'>Pack</SelectItem>
                  <SelectItem value='blister'>Blister</SelectItem>
                  <SelectItem value='caja'>Caja</SelectItem>
                  <SelectItem value='sixpack'>Six Pack</SelectItem>
                  <SelectItem value='docena'>Docena</SelectItem>
                  <SelectItem value='pallet'>Pallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='units'>
                Unidades <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='units'
                type='number'
                min='1'
                value={units}
                onChange={e => setUnits(e.target.value)}
                disabled={isSubmitting || !presentation.is_active}
                placeholder='1'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='price'>
                Precio <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='price'
                type='number'
                min='0'
                step='0.01'
                value={price}
                onChange={e => setPrice(e.target.value)}
                disabled={isSubmitting || !presentation.is_active}
                placeholder='0.00'
                required
              />
            </div>
          </div>
          <div className='hidden grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='barcode'>Código de Barras (No disponible)</Label>
              <Input
                id='barcode'
                disabled
                placeholder='Campo no disponible'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='sku'>SKU (No disponible)</Label>
              <Input
                id='sku'
                disabled
                placeholder='Campo no disponible'
              />
            </div>
          </div>
          <DialogFooter className='flex-col gap-2 sm:flex-row'>
            <div className='flex-1'>
              {presentation.is_active ? (
                showDeleteConfirm ? (
                  <div className='space-y-2'>
                    <p className='text-sm text-destructive'>
                      ¿Confirmas desactivar esta presentación?
                    </p>
                    <div className='flex gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Desactivando...' : 'Confirmar'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting || isDeleting}
                  >
                    Desactivar
                  </Button>
                )
              ) : (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleActivate}
                  disabled={isSubmitting}
                >
                  Reactivar
                </Button>
              )}
            </div>
            {!showDeleteConfirm && (
              <>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={isSubmitting || !presentation.is_active}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className='mr-2 h-4 w-4' />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
