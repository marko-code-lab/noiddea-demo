'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { createBranchEmployee } from '@/services/user-actions';
import { createBranchEmployeeClient, validateEmailClient } from '@/lib/db/client-actions';
import { isNative } from "@/lib/native";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon, PlusSignIcon, CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useSelectedBranch, useBusiness, useUser, useDebounce } from '@/hooks';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupButton } from '@/components/ui/input-group';
import { InputGroupInput } from '@/components/ui/input-group';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CreateUserDialogProps {
  onSuccess?: () => void;
}


export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedBranch } = useSelectedBranch();
  const { business } = useBusiness();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    emailName: '', // Solo el nombre del email (sin @domain.shop)
    phone: '',
    password: '',
    role: 'cashier',
  });

  // Estados para validación de email
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [emailValidating, setEmailValidating] = useState(false);

  // Debounce del emailName para validación
  const debouncedEmailName = useDebounce(formData.emailName, 500);

  // Función helper para construir el dominio del negocio
  const getBusinessDomain = (businessName: string) => {
    if (!businessName.trim()) return '';
    return `${businessName.trim().toLowerCase().replace(/ /g, '')}.shop`;
  };

  // Email completo para validación y envío
  const fullEmail = formData.emailName.trim() && business?.name
    ? `${formData.emailName.trim()}@${getBusinessDomain(business.name)}`
    : '';

  // Validar email cuando cambie el nombre de usuario o el negocio
  useEffect(() => {
    // Solo validar si tenemos tanto el nombre de usuario como el nombre del negocio
    if (!business?.name || !debouncedEmailName.trim()) {
      setEmailAvailable(null);
      setEmailValidating(false);
      return;
    }

    const emailToValidate = `${debouncedEmailName.trim()}@${getBusinessDomain(business.name)}`;

    const isInTauri = typeof window !== 'undefined' && isNative();

    if (debouncedEmailName.trim().length >= 3) {
      if (!isInTauri) {
        // Modo desarrollo: tratar como disponible
        setEmailAvailable(true);
        setEmailValidating(false);
        return;
      }

      setEmailValidating(true);

      validateEmailClient(emailToValidate)
        .then((result) => {
          setEmailAvailable(result.success);
          setEmailValidating(false);
        })
        .catch((error) => {
          console.error('Error validando email:', error);
          setEmailAvailable(null);
          setEmailValidating(false);
        });
    } else if (debouncedEmailName.trim().length > 0) {
      setEmailAvailable(null);
      setEmailValidating(false);
    } else {
      setEmailAvailable(null);
      setEmailValidating(false);
    }
  }, [debouncedEmailName, business?.name]);

  // Resetear estados cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        emailName: '',
        phone: '',
        password: '',
        role: 'cashier',
      });
      setEmailAvailable(null);
      setEmailValidating(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBranch) {
      toast.error('No hay sucursal seleccionada');
      return;
    }

    if (!business?.name) {
      toast.error('No se encontró el negocio');
      return;
    }

    if (!formData.emailName.trim()) {
      toast.error('El nombre de usuario del correo es requerido');
      return;
    }

    if (formData.emailName.trim().length < 3) {
      toast.error('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    // Validar que el email esté disponible
    if (emailAvailable === false) {
      toast.error('Este correo ya está registrado');
      return;
    }

    if (emailValidating) {
      toast.loading('Validando correo electrónico...');
      return;
    }

    // Si aún no se ha validado, validar ahora
    if (emailAvailable === null) {
      const isInTauri = typeof window !== 'undefined' && isNative();
      if (!isInTauri) {
        // Modo desarrollo: permitir continuar
        setEmailAvailable(true);
      } else {
        setEmailValidating(true);

        const result = await validateEmailClient(fullEmail);
        setEmailValidating(false);

        if (!result.success) {
          toast.error(result.error || 'Este correo ya está registrado');
          return;
        }
        setEmailAvailable(true);
      }
    }

    if (!formData.password || formData.password.length < 8) {
      toast.error('La contraseña debe tener 8 dígitos');
      return;
    }

    // Validar teléfono: debe tener exactamente 9 caracteres si se proporciona
    if (formData.phone.trim() && formData.phone.trim().length !== 9) {
      toast.error('El número de celular debe tener exactamente 9 caracteres');
      return;
    }

    if (!formData.role) {
      toast.error('Selecciona un rol');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (typeof window !== 'undefined' && isNative() && user) {
        result = await createBranchEmployeeClient(user.id, {
          name: formData.name,
          email: fullEmail,
          phone: formData.phone,
          password: formData.password,
          branchId: selectedBranch.id,
          role: formData.role as 'cashier',
          benefit: 0,
        });
      } else {
        result = await createBranchEmployee({
          name: formData.name,
          email: fullEmail,
          phone: formData.phone,
          password: formData.password,
          branchId: selectedBranch.id,
          role: formData.role as 'cashier',
          benefit: 0,
        });
      }

      if (result.success) {
        toast.success('Usuario creado correctamente');
        setOpen(false);
        // Resetear el formulario y estados de validación
        setFormData({
          name: '',
          emailName: '',
          phone: '',
          password: '',
          role: 'cashier',
        });
        setEmailAvailable(null);
        setEmailValidating(false);
        onSuccess?.();
      } else {
        toast.error(result.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al crear usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"> <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} /> Agregar usuario</Button>
      </DialogTrigger>
      <DialogContent className='max-w-md' showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogDescription>
            Agrega un nuevo miembro al negocio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='name'>Nombre</FieldLabel>
              <Input
                id='name'
                value={formData.name}
                placeholder='Marko Guillen'
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='phone'>Teléfono</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>+51</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="000 000 000"
                  id="phone"
                  type="tel"
                  maxLength={9}
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Solo números
                    if (value.length <= 9) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  disabled={isSubmitting}
                  required
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
                      <p>El número de teléfono del usuario</p>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor='email-name'>Nombre de usuario</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id='email-name'
                  type='text'
                  placeholder='usuario'
                  value={formData.emailName}
                  onChange={(e) =>
                    setFormData({ ...formData, emailName: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                  className={cn(
                    emailAvailable === true && 'border-green-500',
                    emailAvailable === false && 'border-red-500'
                  )}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>
                    @{business?.name ? getBusinessDomain(business.name) : 'negocio.shop'}
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  {formData.emailName.trim().length > 0 && (
                    <>
                      {emailValidating ? (
                        <Spinner />
                      ) : emailAvailable === true ? (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                      ) : emailAvailable === false ? (
                        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                      ) : null}
                    </>
                  )}
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor='password'>Contraseña</FieldLabel>
              <FieldDescription>No puede ser modificable</FieldDescription>
              <InputOTP
                maxLength={8}
                value={formData.password}
                onChange={(value) =>
                  setFormData({ ...formData, password: value })
                }
                disabled={isSubmitting}
                >
                <div className='w-full flex justify-center items-center'>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator className='mx-2' />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </div>
              </InputOTP>
            </Field>
            <DialogFooter>
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
                  disabled={
                    isSubmitting ||
                    emailAvailable === false ||
                    emailValidating ||
                    !formData.emailName.trim() ||
                    formData.emailName.trim().length < 3
                  }
                >
                  {isSubmitting && <Spinner />}
                  Crear Usuario
                </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
