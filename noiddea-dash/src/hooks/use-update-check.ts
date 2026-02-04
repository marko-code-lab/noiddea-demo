"use client";

import { useEffect, useState } from "react";
import { checkForUpdates, type UpdateInfo } from "@/lib/updater";
import { toast } from "sonner";

interface UseUpdateCheckOptions {
  /**
   * Si es true, verifica actualizaciones automáticamente al montar el componente
   * @default true
   */
  autoCheck?: boolean;
  
  /**
   * Intervalo en milisegundos para verificar actualizaciones periódicamente
   * Si es 0 o undefined, no verifica periódicamente
   * @default undefined
   */
  checkInterval?: number;
  
  /**
   * Si es true, muestra notificaciones cuando hay actualizaciones disponibles
   * @default true
   */
  showNotifications?: boolean;
  
  /**
   * Callback que se ejecuta cuando se encuentra una actualización
   */
  onUpdateAvailable?: (updateInfo: UpdateInfo) => void;
}

interface UseUpdateCheckReturn {
  /**
   * Información de la actualización disponible, o null si no hay actualización
   */
  updateInfo: UpdateInfo | null;
  
  /**
   * Si está verificando actualizaciones actualmente
   */
  isChecking: boolean;
  
  /**
   * Error al verificar actualizaciones, si hubo alguno
   */
  error: Error | null;
  
  /**
   * Función para verificar actualizaciones manualmente
   */
  check: () => Promise<void>;
  
  /**
   * Limpia el intervalo de verificación periódica
   */
  clearCheckInterval: () => void;
}

/**
 * Hook para verificar actualizaciones de la aplicación
 * 
 * @example
 * ```tsx
 * const { updateInfo, isChecking, check } = useUpdateCheck({
 *   autoCheck: true,
 *   showNotifications: true,
 * });
 * ```
 */
export function useUpdateCheck(
  options: UseUpdateCheckOptions = {}
): UseUpdateCheckReturn {
  const {
    autoCheck = true,
    checkInterval,
    showNotifications = true,
    onUpdateAvailable,
  } = options;

  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const performCheck = async () => {
    if (isChecking) return;

    setIsChecking(true);
    setError(null);

    try {
      const info = await checkForUpdates();

      if (info) {
        setUpdateInfo(info);
        
        if (showNotifications) {
          toast.info(
            `Nueva versión disponible: ${info.version}`,
            {
              description: info.releaseNotes 
                ? info.releaseNotes.slice(0, 100) + (info.releaseNotes.length > 100 ? '...' : '')
                : 'Hay una nueva versión disponible para descargar',
              duration: 10000, // 10 segundos
            }
          );
        }

        if (onUpdateAvailable) {
          onUpdateAvailable(info);
        }
      } else {
        // Limpiar updateInfo si ya no hay actualización disponible
        setUpdateInfo(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      if (showNotifications && error.message !== 'No hay servidor de actualizaciones configurado') {
        console.error('Error al verificar actualizaciones:', error);
        // No mostrar toast de error para no molestar al usuario
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (autoCheck) {
      // Verificar al montar el componente
      performCheck();
    }

    // Verificación periódica
    if (checkInterval && checkInterval > 0) {
      const id = setInterval(() => {
        performCheck();
      }, checkInterval);
      
      setIntervalId(id);
      
      return () => {
        clearInterval(id);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCheck, checkInterval]);

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const clearCheckInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return {
    updateInfo,
    isChecking,
    error,
    check: performCheck,
    clearCheckInterval,
  };
}
