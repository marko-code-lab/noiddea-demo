/**
 * Sistema de verificación de actualizaciones
 * Verifica si hay una nueva versión disponible comparando con un endpoint remoto
 * 
 * ⚠️ NOTA: Esta es la ÚNICA función que requiere conexión a internet.
 * El resto de la aplicación funciona 100% offline.
 */

export interface UpdateInfo {
  version: string;
  available: boolean;
  downloadUrl?: string;
  releaseNotes?: string;
  releaseDate?: string;
}

/**
 * Compara dos versiones en formato semver (x.y.z)
 * Retorna:
 * - 1 si version1 > version2
 * - -1 si version1 < version2
 * - 0 si version1 === version2
 */
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }

  return 0;
}

/**
 * Obtiene la versión actual de la aplicación
 */
export async function getCurrentVersion(): Promise<string> {
  try {
    // Try to get version from package.json or environment
    // Note: Tauri-specific code removed
    if (typeof window !== 'undefined' && (window as any).__APP_VERSION__) {
      return (window as any).__APP_VERSION__;
    }
    // Versión por defecto del package.json
    return '0.1.0';
  } catch (error) {
    console.error('Error obteniendo versión actual:', error);
    // Versión por defecto del package.json
    return '0.1.0';
  }
}

/**
 * Obtiene la URL del servidor de actualizaciones desde variables de entorno o configuración
 */
function getUpdateServerUrl(): string {
  // En desarrollo, puedes usar una URL local o de prueba
  // En producción, deberías configurar esta URL en variables de entorno
  if (typeof window !== 'undefined') {
    const url = (window as any).__UPDATE_SERVER_URL__;
    if (url) return url;
  }

  // URL por defecto - el usuario debería configurar esto
  // En Vite, usar import.meta.env para variables de entorno
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPDATE_SERVER_URL) {
    return import.meta.env.VITE_UPDATE_SERVER_URL;
  }

  return '';
}

/**
 * Verifica si hay una nueva versión disponible
 * @param currentVersion Versión actual de la aplicación
 * @returns Información sobre la actualización disponible, o null si no hay actualización
 */
export async function checkForUpdates(
  currentVersion?: string
): Promise<UpdateInfo | null> {
  try {
    const version = currentVersion || await getCurrentVersion();
    const updateServerUrl = getUpdateServerUrl();

    // Si no hay URL configurada, no verificar actualizaciones
    if (!updateServerUrl) {
      console.log('No hay servidor de actualizaciones configurado');
      return null;
    }

    // Hacer request al servidor de actualizaciones
    const response = await fetch(updateServerUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout de 5 segundos
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error('Error al verificar actualizaciones:', response.statusText);
      return null;
    }

    const data = await response.json();

    // El servidor debería retornar un objeto con la estructura:
    // { version: "0.2.0", downloadUrl?: "...", releaseNotes?: "...", releaseDate?: "..." }
    const latestVersion = data.version || data.latest_version || data.tag_name;

    if (!latestVersion) {
      console.error('Respuesta del servidor no contiene versión');
      return null;
    }

    // Comparar versiones
    const comparison = compareVersions(latestVersion, version);

    if (comparison > 0) {
      // Hay una nueva versión disponible
      return {
        version: latestVersion,
        available: true,
        downloadUrl: data.download_url || data.downloadUrl,
        releaseNotes: data.release_notes || data.releaseNotes || data.body,
        releaseDate: data.release_date || data.releaseDate || data.published_at,
      };
    }

    return null;
  } catch (error) {
    // Silenciar errores de red/timeout para no interrumpir la experiencia del usuario
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Timeout al verificar actualizaciones');
    } else {
      console.error('Error al verificar actualizaciones:', error);
    }
    return null;
  }
}

/**
 * Formatea la información de actualización para mostrar al usuario
 */
export function formatUpdateMessage(updateInfo: UpdateInfo): string {
  const parts = [`Nueva versión disponible: ${updateInfo.version}`];
  
  if (updateInfo.releaseNotes) {
    parts.push(`\n${updateInfo.releaseNotes}`);
  }
  
  return parts.join('');
}
