'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { useBusiness } from '@/hooks';
import { updateBusiness } from '@/app/actions';
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useRouter } from 'next/navigation';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

export function BusinessSettings() {
  const [loading, setLoading] = useState(false);
  const { business: businessData, isLoading, refresh } = useBusiness();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    website: '',
    description: '',
  });

  // Función helper para normalizar el tax_id
  const normalizeTaxId = (taxId: string | null | undefined): string => {
    if (!taxId) return '';
    const normalized = taxId.trim();
    // Convertir "PENDIENTE" a "Pendiente" si existe en la BD
    if (normalized === 'PENDIENTE') {
      return 'Pendiente';
    }
    return normalized;
  };

  // Inicializar el formulario con los datos del negocio
  useEffect(() => {
    if (businessData) {
      setFormData({
        name: businessData.name || '',
        tax_id: normalizeTaxId(businessData.tax_id),
        website: businessData.website || '',
        description: businessData.description || '',
      });
    }
  }, [businessData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessData?.id) {
      toast.error('No se encontró el negocio');
      return;
    }

    // Validación básica
    if (!formData.tax_id.trim()) {
      toast.error('El RUC es requerido');
      return;
    }

    setLoading(true);

    try {
      const result = await updateBusiness(businessData.id, {
        tax_id: formData.tax_id,
        website: formData.website || null,
        description: formData.description || null,
      });

      if (result.success) {
        toast.success('Información del negocio actualizada correctamente');
        
        // Actualizar el formulario con los datos devueltos (optimistic update)
        if (result.business) {
          setFormData({
            name: result.business.name || '',
            tax_id: normalizeTaxId(result.business.tax_id),
            website: result.business.website || '',
            description: result.business.description || '',
          });
        }
        
        // Refrescar el hook para obtener datos actualizados del hook
        refresh();
        
        // Refrescar la página para actualizar componentes del servidor
        router.refresh();
      } else {
        toast.error(result.error || 'Error al actualizar el negocio');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al actualizar el negocio');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (businessData) {
      setFormData({
        name: businessData.name || '',
        tax_id: normalizeTaxId(businessData.tax_id),
        website: businessData.website || '',
        description: businessData.description || '',
      });
      toast.info('Cambios descartados');
    }
  };

  // Verificar si hay cambios (excluyendo el nombre que no se puede cambiar)
  const hasChanges = businessData ? (
    formData.tax_id !== (businessData.tax_id || '') ||
    formData.website !== (businessData.website || '') ||
    formData.description !== (businessData.description || '')
  ) : false;

  if (isLoading) {
    return (
      <div className='space-y-4 w-md'>
        <Skeleton className='h-9' />
        <Skeleton className='h-9' />
        <Skeleton className='h-9' />
        <Skeleton className='h-9' />
        <Skeleton className='h-9' />
        <Skeleton className='h-9' />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet className='w-md'>
        <FieldLegend>Configuraciones</FieldLegend>
        <FieldDescription>Configura la información de tu empresa.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='name'>
              Nombre de empresa
            </FieldLabel>
            <Input
              id='name'
              value={formData.name}
              disabled
              className='bg-muted'
              placeholder='Ej: Mi Empresa S.A.'
            />
            <FieldDescription>El nombre no es modificable, contacte a soporte</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor='description'>Descripción</FieldLabel>
            <Textarea
              id='description'
              placeholder='Describe tu negocio...'
              rows={4}
              className='max-h-40'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={loading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='tax_id'>
              RUC
            </FieldLabel>
            <Input
              id='tax_id'
              value={formData.tax_id}
              onChange={(e) =>
                setFormData({ ...formData, tax_id: e.target.value })
              }
              required
              disabled={loading}
              placeholder='20123456789'
              maxLength={11}
            />
            {formData.tax_id.trim() === 'Pendiente' && (
              <FieldDescription>
                El RUC está pendiente de validación
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor='website'>Sitio Web</FieldLabel>
            <InputGroup>
              <InputGroupInput placeholder="acme.com" className="pl-1!" id="website" type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} disabled={loading} />
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton className="rounded-full" size="icon-xs">
                      <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>El sitio web del negocio</TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <div  className='flex justify-end gap-2'>
              {hasChanges && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleReset}
                  disabled={loading}
                >
                  Descartar
                </Button>
              )}
              <Button type='submit' disabled={loading || !hasChanges}>
                {loading && <Spinner />}
                Guardar cambios
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
