import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { Spinner } from '@/components/ui/spinner';
import { useBusiness, useUser } from '@/hooks';
import { toast } from 'sonner';
import { updateBusiness } from '@/services/business-actions';
import { updateBusinessClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { queryKeys } from '@/lib/query-keys';
import { LoadingOverlay } from '@/components/loading-overlay';

export function SettingsPage() {
  const { business, role, isLoading, refresh: refreshBusiness } = useBusiness();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    description: '',
    website: '',
    location: '',
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

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        tax_id: normalizeTaxId(business.tax_id),
        description: business.description || '',
        website: business.website || '',
        location: business.location || '',
      });
    }
  }, [business]);

  const isOwner = role === 'owner';

  const hasChanges =
    !!business &&
    (formData.name !== (business.name || '') ||
      formData.tax_id !== normalizeTaxId(business.tax_id) ||
      formData.description !== (business.description || '') ||
      formData.website !== (business.website || '') ||
      formData.location !== (business.location || ''));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!business) {
      toast.error('No se encontró el negocio');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('El nombre de la empresa es requerido');
      return;
    }

    if (!formData.tax_id.trim()) {
      toast.error('El RUC es requerido');
      return;
    }

    // Validar RUC: debe tener exactamente 11 caracteres (excepto si es "Pendiente")
    if (formData.tax_id.trim() !== 'Pendiente' && formData.tax_id.trim().length !== 11) {
      toast.error('El RUC debe tener exactamente 11 caracteres');
      return;
    }

    if (!isOwner) {
      toast.error('No tienes permisos para editar este negocio');
      return;
    }

    setLoading(true);

    try {
      let result;
      
      // En Electron, usar la versión cliente que usa IPC
      if (typeof window !== 'undefined' && isNative() && user) {
        result = await updateBusinessClient(user.id, business.id, {
          name: formData.name,
          tax_id: formData.tax_id,
          description: formData.description || null,
          website: formData.website || null,
          location: formData.location || null,
        });
      } else {
        // En servidor, usar la versión de server actions
        result = await updateBusiness(business.id, {
          name: formData.name,
          tax_id: formData.tax_id,
          description: formData.description || null,
          website: formData.website || null,
          location: formData.location || null,
        });
      }

      if (result.success) {
        toast.success('Información del negocio actualizada correctamente');
        // Refrescar el hook useBusiness para obtener los datos actualizados
        refreshBusiness();
        // Invalidar todas las queries relacionadas con el negocio
        queryClient.invalidateQueries({ queryKey: queryKeys.business.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.business.current });
        if (business?.id) {
          queryClient.invalidateQueries({ queryKey: queryKeys.business.detail(business.id) });
        }
        // Reiniciar la página después de un breve delay para que el usuario vea el mensaje de éxito
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(result.error || 'Error al actualizar el negocio');
      }
    } catch (error) {
      console.error('Error actualizando negocio:', error);
      toast.error('Error inesperado al actualizar el negocio');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (business) {
      setFormData({
        name: business.name || '',
        tax_id: normalizeTaxId(business.tax_id),
        description: business.description || '',
        website: business.website || '',
        location: business.location || '',
      });
      toast.info('Cambios descartados');
    }
  };

  if (!business && !isLoading) {
    return null;
  }

  const isDisabled = loading || !isOwner;

  return (
    <div className='h-dvh flex items-center justify-center'>
      <LoadingOverlay isLoading={isLoading} />
      {business && (
      <form onSubmit={handleSubmit}>
        <FieldSet className='w-md'>
          <FieldLegend>Configuraciones del negocio</FieldLegend>
          <FieldDescription>
            Configura la información de tu negocio.
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel>Nombre del negocio</FieldLabel>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                disabled={isDisabled}
                placeholder='Ej: Mi Empresa S.A.'
              />
            </Field>
            <Field>
              <FieldLabel>Ubicación</FieldLabel>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                disabled={isDisabled}
                placeholder='Ej: Av. Principal 123, Lima, Perú'
              />
            </Field>
            <Field>
              <FieldLabel>RUC</FieldLabel>
              <Input
                value={formData.tax_id}
                onChange={(e) => {
                  const value = e.target.value;
                  // Permitir "Pendiente" o solo números con máximo 11 caracteres
                  if (value === 'Pendiente' || value === '') {
                    setFormData((prev) => ({ ...prev, tax_id: value }));
                  } else {
                    const numericValue = value.replace(/\D/g, ''); // Solo números
                    if (numericValue.length <= 11) {
                      setFormData((prev) => ({ ...prev, tax_id: numericValue }));
                    }
                  }
                }}
                required
                disabled={isDisabled}
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
              <FieldLabel>Descripción</FieldLabel>
              <Textarea
                placeholder='Describe tu negocio...'
                rows={4}
                className='max-h-40'
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                disabled={isDisabled}
              />
            </Field>
            <Field>
              <FieldLabel>Sitio Web</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  placeholder='acme.com'
                  className='pl-1!'
                  type='text'
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, website: e.target.value }))
                  }
                  disabled={isDisabled}
                />
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon align='inline-end'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        className='rounded-full'
                        size='icon-xs'
                        disabled={isDisabled}
                      >
                        <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>El sitio web del negocio</p>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field orientation={'horizontal'} className='justify-end'>
              {hasChanges && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleReset}
                  disabled={isDisabled}
                >
                  Descartar
                </Button>
              )}
              <Button
                type='submit'
                disabled={isDisabled || !hasChanges}
              >
                {loading && <Spinner />}
                Guardar cambios
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
      )}
    </div>
  );
}
