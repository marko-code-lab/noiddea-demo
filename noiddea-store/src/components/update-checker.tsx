"use client";

import { useUpdateCheck } from "@/hooks/use-update-check";
import { isTauri } from "@/lib/tauri";

/**
 * Componente que verifica actualizaciones automáticamente al iniciar la aplicación
 * Solo funciona en entorno Tauri (no en navegador)
 * 
 * Este componente no renderiza nada, solo ejecuta la verificación en segundo plano
 */
export function UpdateChecker() {
  // Verificar si estamos en Tauri
  const isNative = typeof window !== "undefined" && isTauri();

  useUpdateCheck({
    autoCheck: isNative, // Solo verificar si estamos en Tauri
    showNotifications: true,
  });

  // El componente no renderiza nada visual
  return null;
}
