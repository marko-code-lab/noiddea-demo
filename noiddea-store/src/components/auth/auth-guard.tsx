'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks';
import { Spinner } from '@/components/ui/spinner';
import { checkUserHasBusiness } from '@/services/user-actions';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading: isLoadingUser } = useUser();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Esperar a que se cargue el usuario
      if (isLoadingUser) {
        return;
      }

      // Si no hay usuario, permitir acceso a las rutas de auth
      if (!user) {
        setIsChecking(false);
        return;
      }

      // Si hay usuario, verificar su estado y redirigir
      try {
        const result = await checkUserHasBusiness();

        if (result.authenticated && result.hasBusiness) {
          // Usuario autenticado con negocio/sucursal
          if (result.isCashier) {
            // Cashier → redirigir a /session
            // Note: /session route doesn't exist yet, so we use window.location.href
            if (typeof window !== 'undefined') {
              window.location.href = '/session';
            }
            return;
          } else {
            // Only cashiers are allowed in this app
            // Owner, admin, or other roles → redirigir a auth (logout)
            navigate('/', { replace: true });
            return;
          }
        } else if (result.authenticated && !result.hasBusiness) {
          // Usuario autenticado pero sin negocio → redirigir a auth
          navigate('/', { replace: true });
          return;
        }

        // Si no está autenticado, permitir acceso
        setIsChecking(false);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        // En caso de error, permitir acceso
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, isLoadingUser]);

  // Mostrar loading mientras verifica
  if (isLoadingUser || isChecking) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Spinner />
      </div>
    );
  }

  // Si no hay usuario o no está autenticado, mostrar el contenido (login/signup)
  return <>{children}</>;
}

