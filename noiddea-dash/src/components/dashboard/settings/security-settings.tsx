'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from "@hugeicons/react";
import { Key01Icon, ShieldIcon } from "@hugeicons/core-free-icons";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Alert02Icon } from "@hugeicons/core-free-icons";
import type { User } from '@/types';

interface SecuritySettingsProps {
  user: User;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <HugeiconsIcon icon={ShieldIcon}  strokeWidth={2} />
          <div>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Account Info */}
        <div className='space-y-4'>
          <div>
            <p className='text-sm font-medium'>Email</p>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
          <div>
            <p className='text-sm font-medium'>Usuario desde</p>
            <p className='text-sm text-muted-foreground'>
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Fecha no disponible'}
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div className='space-y-3'>
          <div>
            <p className='text-sm font-medium'>Contraseña</p>
            <p className='text-sm text-muted-foreground'>
              Última actualización: Nunca
            </p>
          </div>
          <Button variant='outline'>
            <HugeiconsIcon icon={Key01Icon} className='size-4' strokeWidth={2} />
            Cambiar Contraseña
          </Button>
        </div>

        {/* Security Alert */}
        <Alert>
          <HugeiconsIcon icon={Alert02Icon} className='size-4' strokeWidth={2} />
          <AlertTitle>Autenticación de Dos Factores</AlertTitle>
          <AlertDescription>
            Mejora la seguridad de tu cuenta habilitando la autenticación de dos
            factores.
            <Button variant='link' className='p-0 h-auto ml-1'>
              Configurar ahora
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
