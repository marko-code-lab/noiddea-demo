'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HugeiconsIcon } from "@hugeicons/react";
import { SettingsIcon } from "@hugeicons/core-free-icons";

export function PreferencesSettings() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
          <div>
            <CardTitle>Preferencias</CardTitle>
            <CardDescription>
              Personaliza tu experiencia en el sistema
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <Label htmlFor='notifications'>Notificaciones por Email</Label>
            <p className='text-sm text-muted-foreground'>
              Recibe notificaciones sobre cambios importantes
            </p>
          </div>
          <Switch id='notifications' defaultChecked />
        </div>

        <div className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <Label htmlFor='alerts'>Alertas de Stock Bajo</Label>
            <p className='text-sm text-muted-foreground'>
              Te notificaremos cuando el stock esté bajo
            </p>
          </div>
          <Switch id='alerts' defaultChecked />
        </div>

        <div className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <Label htmlFor='reports'>Reportes Semanales</Label>
            <p className='text-sm text-muted-foreground'>
              Recibe un resumen semanal de tu negocio
            </p>
          </div>
          <Switch id='reports' />
        </div>

        <div className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <Label htmlFor='marketing'>Marketing y Promociones</Label>
            <p className='text-sm text-muted-foreground'>
              Recibe noticias sobre nuevas funcionalidades
            </p>
          </div>
          <Switch id='marketing' />
        </div>
      </CardContent>
    </Card>
  );
}
