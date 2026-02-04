import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks';
import { useSession } from '@/components/providers/session-provider';
import { useBranch } from '@/components/providers/branch-provider';
import { Spinner } from '@/components/ui/spinner';
import { startUserSessionClient } from '@/lib/db/client-actions';
import { startUserSession } from '@/services/sessions';
import { isNative } from "@/lib/native";

interface SessionGuardProps {
  children: React.ReactNode;
}

export function SessionGuard({ children }: SessionGuardProps) {
  const { user } = useUser();
  const session = useSession();
  const { branch } = useBranch();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const sessionInitializedRef = useRef(false);

  useEffect(() => {
    // Wait for session to load
    if (session.loading) {
      return;
    }

    // If not authenticated or no business, redirect to auth
    if (!session.authenticated || !session.hasBusiness) {
      navigate("/login", { replace: true });
      return;
    }

    // If owner, redirect to dashboard/subscription (shouldn't access session)
    if (session.isOwner) {
      navigate("/dashboard/subscription", { replace: true });
      return;
    }

    // If cashier, allow access and create session if needed
    if (session.isCashier) {
      const branchIdToUse = session.branchId || branch?.id || session.businessId;
      
      if (user && branchIdToUse) {
        // Only create session once per mount
        if (!sessionInitializedRef.current) {
          sessionInitializedRef.current = true;
          // Crear sesión y esperar a que se complete antes de renderizar
          (async () => {
            try {
              if (typeof window !== 'undefined' && isNative()) {
                const result = await startUserSessionClient(user.id, branchIdToUse);
                if (!result.success) {
                  console.error('[SessionGuard] Error al crear sesión de usuario:', result.error);
                  console.error('[SessionGuard] userId:', user.id, 'branchId:', branchIdToUse);
                } else {
                  console.log('[SessionGuard] Sesión creada exitosamente:', result.sessionId);
                }
              } else {
                const result = await startUserSession(user.id, branchIdToUse);
                if (!result.success) {
                  console.error('[SessionGuard] Error al crear sesión de usuario:', result.error);
                  console.error('[SessionGuard] userId:', user.id, 'branchId:', branchIdToUse);
                } else {
                  console.log('[SessionGuard] Sesión creada exitosamente:', result.sessionId);
                }
              }
            } catch (error) {
              console.error('[SessionGuard] Error inesperado al crear sesión de usuario:', error);
              console.error('[SessionGuard] userId:', user.id, 'branchId:', branchIdToUse);
              // No bloquear el acceso si falla la creación de sesión
            } finally {
              setIsChecking(false);
            }
          })();
          return; // Return early, setIsChecking will be called in the async function
        }
      }
      
      // Si no hay user o branchId, aún así permitir acceso pero sin crear sesión
      setIsChecking(false);
      return;
    }

    // If no valid role, redirect to auth
    navigate("/login", { replace: true });
  }, [session, user, branch, navigate]);

  // Show loading while checking
  if (session.loading || isChecking) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Spinner />
      </div>
    );
  }

  // Only show content if authenticated, has business, and is cashier
  if (!session.authenticated || !session.hasBusiness || !session.isCashier) {
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
