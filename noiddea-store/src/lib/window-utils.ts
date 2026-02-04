/**
 * Utilidades para manejar múltiples ventanas en Tauri
 * Permite abrir ventanas adicionales con rutas específicas
 */

import { Window } from '@tauri-apps/api/window';
import { getCurrent } from '@tauri-apps/api/window';

/**
 * Obtiene la URL base dependiendo del entorno (desarrollo o producción)
 */
function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // En desarrollo, Tauri usa http://localhost:3000
  // En producción, Tauri usa rutas relativas
  const isDev = window.location.protocol === 'http:' || window.location.hostname === 'localhost';
  
  if (isDev) {
    // En desarrollo, usar la URL del servidor de desarrollo
    const port = window.location.port || '3000';
    return `http://localhost:${port}`;
  }
  
  // En producción, usar rutas relativas (Tauri las maneja automáticamente)
  return '';
}

/**
 * Construye la URL completa para una ruta específica
 */
function buildUrl(route: string): string {
  const baseUrl = getBaseUrl();
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  
  if (baseUrl) {
    return `${baseUrl}${cleanRoute}`;
  }
  
  return cleanRoute;
}

/**
 * Opciones para crear una nueva ventana
 */
export interface OpenWindowOptions {
  /** Ruta a abrir (ej: '/dashboard', '/session') */
  route: string;
  /** Etiqueta única para la ventana (por defecto se genera automáticamente) */
  label?: string;
  /** Título de la ventana */
  title?: string;
  /** Ancho de la ventana en píxeles */
  width?: number;
  /** Alto de la ventana en píxeles */
  height?: number;
  /** Si la ventana es redimensionable */
  resizable?: boolean;
  /** Si la ventana debe estar centrada */
  center?: boolean;
  /** Si la ventana debe estar enfocada al abrir */
  focus?: boolean;
  /** Si la ventana debe estar siempre visible (always on top) */
  alwaysOnTop?: boolean;
  /** Si la ventana debe estar maximizada */
  maximized?: boolean;
  /** Si la ventana debe estar minimizada */
  minimized?: boolean;
  /** Ventana padre (para crear ventanas hijas) */
  parent?: Window;
}

/**
 * Abre una nueva ventana con la ruta especificada
 * 
 * @example
 * ```typescript
 * import { openWindow } from '@/lib/window-utils';
 * 
 * // Abrir ventana de dashboard
 * await openWindow({ route: '/dashboard', title: 'Dashboard' });
 * 
 * // Abrir ventana de sesión
 * await openWindow({ route: '/session', title: 'Sesión', width: 1200, height: 800 });
 * ```
 */
export async function openWindow(options: OpenWindowOptions): Promise<Window> {
  const {
    route,
    label,
    title,
    width = 800,
    height = 600,
    resizable = true,
    center = true,
    focus = true,
    alwaysOnTop = false,
    maximized = false,
    minimized = false,
    parent,
  } = options;

  // Generar label único si no se proporciona
  const windowLabel = label || `window-${route.replace(/\//g, '-').replace(/^-/, '')}-${Date.now()}`;
  
  // Construir la URL
  const url = buildUrl(route);

  // Crear la nueva ventana
  const newWindow = new Window(windowLabel, {
    url,
    title: title || `Kapok Preview - ${route}`,
    width,
    height,
    resizable,
    center,
    focus,
    alwaysOnTop,
    maximized,
    minimized,
    parent: parent ? parent.label : undefined,
  });

  // Esperar a que la ventana se cree
  return new Promise((resolve, reject) => {
    newWindow.once('tauri://created', () => {
      resolve(newWindow);
    });

    newWindow.once('tauri://error', (error) => {
      reject(new Error(`Error al crear la ventana: ${error}`));
    });
  });
}

/**
 * Abre una ventana de dashboard
 */
export async function openDashboardWindow(options?: Omit<OpenWindowOptions, 'route'>): Promise<Window> {
  return openWindow({
    route: '/dashboard',
    title: 'Dashboard',
    width: 1200,
    height: 800,
    ...options,
  });
}

/**
 * Abre una ventana de sesión
 */
export async function openSessionWindow(options?: Omit<OpenWindowOptions, 'route'>): Promise<Window> {
  return openWindow({
    route: '/session',
    title: 'Sesión',
    width: 1000,
    height: 700,
    ...options,
  });
}

/**
 * Verifica si una ventana con el label especificado ya existe
 */
export async function windowExists(label: string): Promise<boolean> {
  try {
    const window = await Window.getByLabel(label);
    return window !== null;
  } catch {
    return false;
  }
}

/**
 * Obtiene o crea una ventana con el label especificado
 * Si la ventana ya existe, la enfoca; si no, la crea
 */
export async function getOrCreateWindow(options: OpenWindowOptions): Promise<Window> {
  const label = options.label || `window-${options.route.replace(/\//g, '-').replace(/^-/, '')}`;
  
  // Verificar si la ventana ya existe
  const existingWindow = await Window.getByLabel(label);
  
  if (existingWindow) {
    // Si existe, enfocarla y traerla al frente
    await existingWindow.setFocus();
    await existingWindow.unminimize();
    return existingWindow;
  }
  
  // Si no existe, crear una nueva
  return openWindow({ ...options, label });
}

/**
 * Cierra una ventana por su label
 */
export async function closeWindow(label: string): Promise<void> {
  const window = await Window.getByLabel(label);
  if (window) {
    await window.close();
  }
}

/**
 * Obtiene todas las ventanas abiertas
 */
export async function getAllWindows(): Promise<Window[]> {
  return Window.getAll();
}

/**
 * Obtiene la ventana actual
 */
export function getCurrentWindow(): Window {
  return getCurrent();
}
