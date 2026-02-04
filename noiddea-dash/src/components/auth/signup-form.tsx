'use client';

import { signupUserClient, validateBusinessNameClient, validateEmailClient } from '@/lib/db/client-actions';
import { isNative } from '@/lib/native';
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
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '../ui/input-group';
import { Tooltip } from '@/components/ui/tooltip';
import { useDebounce } from '@/hooks/use-debounce';
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Cancel01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps
  extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  onSubmitSuccess?: () => void;
}

export function SignupForm({
  className,
  onSubmitSuccess,
  ...props
}: SignupFormProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('business');
  const [businessName, setBusinessName] = useState('');
  const [businessNameValidating, setBusinessNameValidating] = useState(false);
  const [businessNameAvailable, setBusinessNameAvailable] = useState<boolean | null>(null);
  const [emailName, setEmailName] = useState(''); // Solo el nombre del email (sin @mail.com)
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función helper para construir el dominio del negocio
  const getBusinessDomain = (businessName: string) => {
    if (!businessName.trim()) return '';
    return `${businessName.trim().toLowerCase().replace(/ /g, '')}.app`;
  };

  // Email completo para validación y envío
  const fullEmail = emailName.trim() && businessName.trim() 
    ? `${emailName.trim()}@${getBusinessDomain(businessName)}` 
    : '';

  // Debounce para validar nombre del negocio
  const debouncedBusinessName = useDebounce(businessName, 500);

  useEffect(() => {
    const isInTauri = typeof window !== 'undefined' && isNative();

    if (debouncedBusinessName.trim().length >= 3) {
      setBusinessNameValidating(true);
      
      // Modo desarrollo (navegador): tratar como disponible para poder probar el flujo
      if (!isInTauri) {
        setBusinessNameAvailable(true);
        setBusinessNameValidating(false);
        return;
      }
      
      validateBusinessNameClient(debouncedBusinessName)
        .then((result) => {
          const isAvailable = result.success && result.available === true;
          setBusinessNameAvailable(isAvailable);
          setBusinessNameValidating(false);
        })
        .catch((error) => {
          setBusinessNameAvailable(null);
          setBusinessNameValidating(false);
        });
    } else if (debouncedBusinessName.trim().length > 0) {
      setBusinessNameAvailable(null);
      setBusinessNameValidating(false);
    } else {
      setBusinessNameAvailable(null);
      setBusinessNameValidating(false);
    }
  }, [debouncedBusinessName]);

  // Debounce para validar email
  const debouncedEmailName = useDebounce(emailName, 500);
  const debouncedBusinessNameForEmail = useDebounce(businessName, 500);

  useEffect(() => {
    // Solo validar si tenemos tanto el nombre de usuario como el nombre del negocio
    if (!debouncedBusinessNameForEmail.trim() || !debouncedEmailName.trim()) {
      setEmailAvailable(null);
      setEmailValidating(false);
      return;
    }

    const emailToValidate = `${debouncedEmailName.trim()}@${getBusinessDomain(debouncedBusinessNameForEmail)}`;
    
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
  }, [debouncedEmailName, debouncedBusinessNameForEmail]);

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      toast.error('El nombre del negocio es requerido');
      return;
    }

    if (businessName.trim().length < 3) {
      toast.error('El nombre del negocio debe tener al menos 3 caracteres');
      return;
    }

    // Validar que el nombre esté disponible
    if (businessNameAvailable === false) {
      toast.error('Este nombre de negocio ya está en uso');
      return;
    }

    if (businessNameValidating) {
      toast.loading('Validando nombre del negocio...');
      return;
    }

    // Si aún no se ha validado, validar ahora
    if (businessNameAvailable === null) {
      const isInTauri = typeof window !== 'undefined' && isNative();
      if (!isInTauri) {
        // Modo desarrollo: permitir continuar sin validar
        setBusinessNameAvailable(true);
        setActiveTab('user-info');
        return;
      }
      
      setBusinessNameValidating(true);
      
      try {
        const result = await validateBusinessNameClient(businessName);
        setBusinessNameValidating(false);
        
        if (!result.success || !result.available) {
          toast.error(result.error || 'Este nombre de negocio ya está en uso');
          return;
        }
        setBusinessNameAvailable(true);
      } catch (error) {
        setBusinessNameValidating(false);
        toast.error('Error validando nombre del negocio. Intenta nuevamente.');
        return;
      }
    }

    setActiveTab('user-info');
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si estamos en la pestaña user-info, solo cambiar a create-password (esto no debería pasar ahora, pero por seguridad)
    if (activeTab === 'user-info') {
      setActiveTab('create-password');
      return;
    }

    // Solo proceder si estamos en la pestaña create-password
    if (activeTab !== 'create-password') {
      return;
    }

    if (!name.trim()) {
      toast.error('El nombre completo es requerido');
      return;
    }

    if (!phone.trim()) {
      toast.error('El teléfono es requerido');
      return;
    }

    // Validar teléfono: debe tener exactamente 9 caracteres
    if (phone.trim().length !== 9) {
      toast.error('El número de celular debe tener exactamente 9 caracteres');
      return;
    }

    if (!emailName.trim()) {
      toast.error('El nombre de usuario del correo es requerido');
      return;
    }

    if (emailName.trim().length < 3) {
      toast.error('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (!businessName.trim()) {
      toast.error('El nombre del negocio es requerido');
      return;
    }

    const emailToValidate = `${emailName.trim()}@${getBusinessDomain(businessName)}`;

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
        
        const result = await validateEmailClient(emailToValidate);
        setEmailValidating(false);
        
        if (!result.success) {
          toast.error(result.error || 'Este correo ya está registrado');
          return;
        }
        setEmailAvailable(true);
      }
    }

    // Validación de contraseña
    if (!password || password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const isInTauri = typeof window !== 'undefined' && isNative();

    // La app solo funciona en Tauri. Si estamos en el navegador, avisar sin intentar registro.
    if (!isInTauri) {
      toast.error(
        'Para crear una cuenta debes ejecutar la aplicación con Tauri: npm run tauri dev'
      );
      return;
    }

    // Si todo está válido, proceder con el registro
    setIsLoading(true);

    try {
      const result = await signupUserClient({
        email: fullEmail,
        name: name.trim(),
        phone: phone.trim(),
        password,
        businessName: businessName.trim(),
      });

      if (result.success) {
        const loadingToast = toast.loading('Redirigiendo al inicio de sesión...');

        if (onSubmitSuccess) {
          onSubmitSuccess();
        }

        // Redirigir al login después de un breve delay
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.dismiss(loadingToast);
        navigate('/login', { replace: true });
      } else {
        toast.error(result.error || 'Error creando cuenta');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error creando cuenta. Intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <FieldSet className='w-full w-sm'>
      <FieldLegend className='text-center text-2xl!'>Crear nuevo negocio</FieldLegend>
      <FieldDescription className='text-center'>
        {
          activeTab === 'business' ? 'Registra tu negocio para empezar a usar la plataforma' : activeTab === 'user-info' ? 'Completa la información de tu negocio' : 'Crea una contraseña para ingresar a la plataforma'
        }
      </FieldDescription>
      <div className={cn('w-full', className)} {...props}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full'
        >
          <TabsContent value='business' className='space-y-6'>
            <form onSubmit={handleBusinessSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='business-name'>Nombre de negocio</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id='business-name'
                      type='text'
                      placeholder='Acme Inc.'
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      required
                      disabled={isLoading}
                      autoFocus
                      className={cn(
                        businessNameAvailable === true && 'border-green-500',
                        businessNameAvailable === false && 'border-red-500'
                      )}
                    />
                    {businessName.trim().length > 0 && (
                      <InputGroupAddon align="inline-end">
                        {businessNameValidating ? (
                          <Spinner />
                        ) : businessNameAvailable === true ? (
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                        ) : businessNameAvailable === false ? (
                          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                        ) : null}
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </Field>
                <Field>
                  <Button 
                    type='submit' 
                    className='w-full'
                    disabled={businessNameValidating || businessNameAvailable === false || !businessName.trim()}
                  >
                    Continuar
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </TabsContent>

            <form onSubmit={handleUserInfoSubmit}>
              <TabsContent value='user-info' className='space-y-6'>
                <FieldGroup>
                  <Field>
                    <div className='flex items-center'>
                      <FieldLabel htmlFor='business-name-display'>
                        Nombre de negocio
                      </FieldLabel>
                      <a
                        onClick={() => setActiveTab('business')}
                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                      >
                        Cambiar
                      </a>
                    </div>
                    <Input
                      id='business-name-display'
                      type='text'
                      value={businessName}
                      disabled
                      className='bg-muted'
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='name'>Nombre completo</FieldLabel>
                    <Input
                      id='name'
                      type='text'
                      placeholder='Juan Pérez'
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      disabled={isLoading}
                      autoFocus
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
                        value={phone} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Solo números
                          if (value.length <= 9) {
                            setPhone(value);
                          }
                        }} 
                        maxLength={9}
                        disabled={isLoading} 
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
                        value={emailName}
                        onChange={e => setEmailName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>@{businessName.trim().toLowerCase().replace(/ /g, '')}.app</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <Button
                      type='button'
                      className='w-full'
                      onClick={() => setActiveTab('create-password')}
                      disabled={isLoading || !name.trim() || !phone.trim() || !emailName.trim() || emailName.trim().length < 3 || emailAvailable === false || emailValidating}
                    >
                     Continuar
                    </Button>
                  </Field>
                </FieldGroup>
              </TabsContent>
              <TabsContent value='create-password'>
                <FieldGroup>
                  <Field>
                    <div className='flex justify-center'>
                      <InputOTP maxLength={8} value={password} onChange={(value) => setPassword(value)}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                        <InputOTPSeparator className='mx-2'/>
                        <InputOTPGroup>
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                          <InputOTPSlot index={6} />
                          <InputOTPSlot index={7} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </Field>
                  <Field>
                    <Button
                      type='submit'
                      className='w-full'
                      disabled={isLoading || !name.trim() || !phone.trim() || !emailName.trim() || emailName.trim().length < 3 || emailAvailable === false || emailValidating || !password || password.length < 8}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isLoading ? <Spinner /> : 'Crear negocio'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setActiveTab('user-info')}
                      disabled={isLoading}
                    >
                      Regresar
                    </Button>
                  </Field>
                </FieldGroup>
              </TabsContent>
            </form>
        </Tabs>
      </div>
    </FieldSet>
  );
}
