/**
 * Actions para gestión de negocios
 * 100% CLIENTE: Usa IPC de Tauri - Funciona completamente offline
 */

import { queryOne, query, transaction, execute, generateId } from '@/lib/database';
import { isNative } from '@/lib/native';

// Función de sesión simple para Tauri (usando localStorage)
function getSession(): { userId: string; email: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('kapok-session-user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Valida que el nombre del negocio no esté en uso
 * 100% CLIENTE: Usa IPC de Tauri
 */
export async function validateBusinessName(name: string) {
  try {
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Esta función solo funciona en el cliente Tauri',
      };
    }

    if (!isNative()) {
      return {
        success: false,
        error: 'Esta función requiere Tauri. Por favor, ejecuta la aplicación usando: npm run tauri dev',
      };
    }

    if (!name || !name.trim()) {
      return { success: false, error: 'El nombre del negocio es requerido' };
    }

    const trimmedName = name.trim();
    
    // Verificar si el nombre ya está en uso usando IPC
    const existingBusiness = await queryOne<{ id: string }>(
      `SELECT id FROM businesses WHERE name = ? LIMIT 1`,
      [trimmedName]
    );

    if (existingBusiness) {
      return {
        success: false,
        error: 'Este nombre de negocio ya está en uso',
        available: false,
      };
    }

    return { success: true, available: true };
  } catch (error) {
    console.error('Error validando nombre de negocio:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for IPC handler errors
      if (error.message.includes('No handler registered') || error.message.includes('handlers de base de datos')) {
        errorMessage = 'Los handlers de base de datos no están registrados. Por favor, reinicia la aplicación Tauri o ejecuta: npm run tauri dev';
      } else if (error.message.includes('Database API no está disponible')) {
        errorMessage = 'La base de datos no está disponible. Asegúrate de que la aplicación Tauri esté corriendo.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Crea un nuevo negocio y asigna al usuario actual como owner
 * 100% CLIENTE: Usa IPC de Tauri
 */
export async function createBusiness(data: {
  name: string;
  tax_id: string;
  description?: string;
  website?: string;
}) {
  try {
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Esta función solo funciona en el cliente Tauri',
      };
    }

    if (!isNative()) {
      return {
        success: false,
        error: 'Esta función requiere Tauri. Por favor, ejecuta la aplicación usando: npm run tauri dev',
      };
    }

    // Validar datos
    if (!data.name || !data.tax_id) {
      return { success: false, error: 'Nombre y RFC/Tax ID son requeridos' };
    }

    const session = getSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    console.log('🔍 Usuario autenticado:', session.userId, session.email);

    // Verificar si el usuario ya tiene un negocio usando IPC
    const existingBusiness = await queryOne<{ business_id: string }>(
      `SELECT business_id FROM businesses_users WHERE user_id = ? LIMIT 1`,
      [session.userId]
    );

    if (existingBusiness) {
      return {
        success: false,
        error: 'Ya tienes un negocio creado',
        businessId: existingBusiness.business_id,
      };
    }

    // Verificar que el nombre no esté en uso
    const nameCheck = await validateBusinessName(data.name.trim());
    if (!nameCheck.success || !nameCheck.available) {
      return nameCheck;
    }

    // Generar IDs
    const businessId = generateId();
    const businessUserId = generateId();

    // ELIMINADO: Creación de branch
    // Ahora trabajamos directamente con business, sin branches
    // Crear el negocio y asignar usuario en una transacción usando IPC
    await transaction([
      // 1. Crear el negocio
      {
        sql: `INSERT INTO businesses (id, name, tax_id, description, website) VALUES (?, ?, ?, ?, ?)`,
        params: [
          businessId,
          data.name.trim(),
          data.tax_id.trim(),
          data.description?.trim() || null,
          data.website?.trim() || null,
        ],
      },
      // 2. Asignar al usuario como owner del negocio
      {
        sql: `INSERT INTO businesses_users (id, business_id, user_id, role, is_active) VALUES (?, ?, ?, ?, ?)`,
        params: [businessUserId, businessId, session.userId, 'owner', 1],
      },
    ]);

    console.log('✅ Negocio creado:', businessId, data.name.trim());
    console.log('✅ Usuario asignado como owner:', session.userId, '→', businessId);

    return {
      success: true,
      businessId,
      businessName: data.name.trim(),
    };
  } catch (error) {
    console.error('❌ Error en createBusiness:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for IPC handler errors
      if (error.message.includes('No handler registered') || error.message.includes('handlers de base de datos')) {
        errorMessage = 'Los handlers de base de datos no están registrados. Por favor, reinicia la aplicación Tauri o ejecuta: npm run tauri dev';
      } else if (error.message.includes('Database API no está disponible')) {
        errorMessage = 'La base de datos no está disponible. Asegúrate de que la aplicación Tauri esté corriendo.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Actualiza la información de un negocio
 * 100% CLIENTE: Usa IPC de Tauri
 */
export async function updateBusiness(
  businessId: string,
  data: {
    name?: string;
    tax_id?: string;
    description?: string | null;
    website?: string | null;
    location?: string | null;
  }
) {
  try {
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Esta función solo funciona en el cliente Tauri',
      };
    }

    if (!isNative()) {
      return {
        success: false,
        error: 'Esta función requiere Tauri. Por favor, ejecuta la aplicación usando: npm run tauri dev',
      };
    }

    const session = getSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    // Verificar que el usuario tenga permisos (owner del negocio) usando IPC
    const businessUser = await queryOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId, businessId]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para editar este negocio',
      };
    }

    // Si se está actualizando el nombre, validar que no esté en uso (excepto por el negocio actual)
    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) {
        return { success: false, error: 'El nombre del negocio es requerido' };
      }

      const existingBusiness = await queryOne<{ id: string }>(
        `SELECT id FROM businesses WHERE name = ? AND id != ? LIMIT 1`,
        [trimmedName, businessId]
      );

      if (existingBusiness) {
        return {
          success: false,
          error: 'Este nombre de negocio ya está en uso',
        };
      }
    }

    // Preparar datos para actualizar
    const updates: string[] = [];
    const params: (string | null)[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name.trim());
    }
    if (data.tax_id !== undefined) {
      updates.push('tax_id = ?');
      params.push(data.tax_id.trim());
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description?.trim() || null);
    }
    if (data.website !== undefined) {
      updates.push('website = ?');
      params.push(data.website?.trim() || null);
    }
    if (data.location !== undefined) {
      updates.push('location = ?');
      params.push(data.location?.trim() || null);
    }

    if (updates.length === 0) {
      return { success: false, error: 'No hay datos para actualizar' };
    }

    params.push(businessId);

    // Actualizar el negocio usando IPC
    await execute(
      `UPDATE businesses SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Obtener el negocio actualizado usando IPC
    interface BusinessRow {
      id: string;
      name: string;
      tax_id: string;
      description: string | null;
      website: string | null;
      location: string | null;
      created_at: string;
    }
    
    const updatedBusiness = await queryOne<BusinessRow>(
      `SELECT * FROM businesses WHERE id = ?`,
      [businessId]
    );

    return {
      success: true,
      business: updatedBusiness,
    };
  } catch (error) {
    console.error('Error en updateBusiness:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for IPC handler errors
      if (error.message.includes('No handler registered') || error.message.includes('handlers de base de datos')) {
        errorMessage = 'Los handlers de base de datos no están registrados. Por favor, reinicia la aplicación Tauri o ejecuta: npm run tauri dev';
      } else if (error.message.includes('Database API no está disponible')) {
        errorMessage = 'La base de datos no está disponible. Asegúrate de que la aplicación Tauri esté corriendo.';
      }
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}
