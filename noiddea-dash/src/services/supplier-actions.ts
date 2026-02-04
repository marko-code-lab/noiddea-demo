import { getServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';
import { generateId } from '@/lib/database';
import type { SupplierInsert, SupplierUpdate } from '@/types';

/**
 * Obtiene todos los proveedores de un negocio
 */
export async function getSuppliers(businessId: string) {
  const db = getDatabaseClient();

  try {
    const suppliers = await db.select<any>(
      `SELECT * FROM suppliers WHERE business_id = ? AND is_active = 1 ORDER BY name ASC`,
      [businessId]
    );

    return { success: true, data: suppliers };
  } catch (error) {
    console.error('Error in getSuppliers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene un proveedor por ID
 */
export async function getSupplierById(supplierId: string) {
  const db = getDatabaseClient();

  try {
    const supplier = await db.selectOne<any>(
      `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    if (!supplier) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    return { success: true, data: supplier };
  } catch (error) {
    console.error('Error in getSupplierById:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Crea un nuevo proveedor
 */
export async function createSupplier(supplier: SupplierInsert) {
  const db = getDatabaseClient();

  try {
    // Validar que el usuario tenga permisos (owner)
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'No autenticado' };
    }

    const businessUser = await db.selectOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId, supplier.business_id]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para crear proveedores',
      };
    }

    const supplierId = generateId();
    const now = new Date().toISOString();

    await db.mutate(
      `INSERT INTO suppliers (id, business_id, name, ruc, phone, address, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        supplierId,
        supplier.business_id,
        supplier.name,
        supplier.ruc || null,
        supplier.phone || null,
        supplier.address || null,
        supplier.is_active !== undefined ? (supplier.is_active ? 1 : 0) : 1,
        now,
      ]
    );

    const createdSupplier = await db.selectOne<any>(
      `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true, data: createdSupplier };
  } catch (error) {
    console.error('Error in createSupplier:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza un proveedor
 */
export async function updateSupplier(
  supplierId: string,
  updates: SupplierUpdate
) {
  const db = getDatabaseClient();

  try {
    // Validar que el usuario tenga permisos
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener el proveedor para verificar el business_id
    const supplier = await db.selectOne<{ business_id: string }>(
      `SELECT business_id FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    if (!supplier) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    const businessUser = await db.selectOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId, supplier.business_id]
    );

    if (!businessUser || businessUser.role !== 'owner') {
      return {
        success: false,
        error: 'No tienes permisos para actualizar este proveedor',
      };
    }

    // Construir query de actualización
    const updateFields: string[] = [];
    const updateParams: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      updateParams.push(updates.name);
    }
    if (updates.ruc !== undefined) {
      updateFields.push('ruc = ?');
      updateParams.push(updates.ruc);
    }
    if (updates.phone !== undefined) {
      updateFields.push('phone = ?');
      updateParams.push(updates.phone);
    }
    if (updates.address !== undefined) {
      updateFields.push('address = ?');
      updateParams.push(updates.address);
    }
    if (updates.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(updates.is_active ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return { success: false, error: 'No hay campos para actualizar' };
    }
    updateParams.push(supplierId);

    await db.mutate(
      `UPDATE suppliers SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    const updatedSupplier = await db.selectOne<any>(
      `SELECT * FROM suppliers WHERE id = ? LIMIT 1`,
      [supplierId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true, data: updatedSupplier };
  } catch (error) {
    console.error('Error in updateSupplier:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Desactiva un proveedor (soft delete)
 */
export async function deactivateSupplier(supplierId: string) {
  return updateSupplier(supplierId, { is_active: 0 });
}

/**
 * Reactiva un proveedor
 */
export async function activateSupplier(supplierId: string) {
  return updateSupplier(supplierId, { is_active: 1 });
}

/**
 * Busca proveedores por nombre
 */
export async function searchSuppliers(businessId: string, searchTerm: string) {
  const db = getDatabaseClient();

  try {
    const suppliers = await db.select<any>(
      `SELECT * FROM suppliers 
       WHERE business_id = ? 
       AND is_active = 1 
       AND name LIKE ? 
       ORDER BY name ASC 
       LIMIT 10`,
      [businessId, `%${searchTerm}%`]
    );

    return { success: true, data: suppliers };
  } catch (error) {
    console.error('Error in searchSuppliers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
