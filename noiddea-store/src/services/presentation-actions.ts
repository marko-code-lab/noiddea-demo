/**
 * Actions para gesti?n de presentaciones de productos
 */

import { getServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';
import { generateId } from '@/lib/database';
import type {
  ProductPresentationInsert,
  ProductPresentationUpdate,
} from '@/types';

/**
 * Crea una nueva presentaci?n para un producto existente
 * Campos disponibles: variant, units, price, product_id, is_active
 */
export async function createPresentation(data: {
  product_id: string;
  variant: string;  // Tipo de presentaci?n: pack, blister, caja, etc.
  units: number;    // Cantidad de unidades en esta presentaci?n
  price?: number;   // Precio de venta de esta presentaci?n
}) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Verificar que el producto existe y obtener el business_id a trav?s del branch
    const product = await db.selectOne<{
      branch_id: string;
      business_id: string;
    }>(
      `SELECT 
        p.branch_id,
        b.business_id
       FROM products p
       INNER JOIN branches b ON b.id = p.branch_id
       WHERE p.id = ? LIMIT 1`,
      [data.product_id]
    );

    if (!product || !product.business_id) {
      return { success: false, error: 'Producto no encontrado' };
    }

    // Verificar permisos del usuario
    const businessUser = await db.selectOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId, product.business_id]
    );

    if (!businessUser) {
      return {
        success: false,
        error: 'No tienes permisos para crear presentaciones',
      };
    }

    // Crear la presentaci?n
    const presentationId = generateId();
    const now = new Date().toISOString();

    await db.mutate(
      `INSERT INTO product_presentations (id, product_id, variant, units, price, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        presentationId,
        data.product_id,
        data.variant.trim(),
        data.units,
        data.price || null,
        1,
        now,
        now,
      ]
    );

    const presentation = await db.selectOne<any>(
      `SELECT * FROM product_presentations WHERE id = ? LIMIT 1`,
      [presentationId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true, data: presentation };
  } catch (error) {
    console.error('Error en createPresentation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza una presentaci?n existente
 * Campos disponibles: variant, units, price, is_active
 */
export async function updatePresentation(
  presentationId: string,
  data: {
    variant?: string;
    units?: number;
    price?: number;
    is_active?: boolean;
  }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: 'Debes estar autenticado' };
    }

    const db = getDatabaseClient();

    // Obtener la presentaci?n para verificar el producto y el business_id
    const presentation = await db.selectOne<{
      product_id: string;
      business_id: string;
    }>(
      `SELECT 
        pp.product_id,
        b.business_id
       FROM product_presentations pp
       INNER JOIN products p ON p.id = pp.product_id
       INNER JOIN branches b ON b.id = p.branch_id
       WHERE pp.id = ? LIMIT 1`,
      [presentationId]
    );

    if (!presentation || !presentation.business_id) {
      return { success: false, error: 'Presentaci?n no encontrada' };
    }

    // Verificar permisos del usuario
    const businessUser = await db.selectOne<{ role: string }>(
      `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
      [session.userId, presentation.business_id]
    );

    if (!businessUser) {
      return {
        success: false,
        error: 'No tienes permisos para editar presentaciones',
      };
    }

    // Construir query de actualizaci?n
    const updateFields: string[] = [];
    const updateParams: any[] = [];

    if (data.variant !== undefined) {
      updateFields.push('variant = ?');
      updateParams.push(data.variant.trim());
    }
    if (data.units !== undefined) {
      updateFields.push('units = ?');
      updateParams.push(data.units);
    }
    if (data.price !== undefined) {
      updateFields.push('price = ?');
      updateParams.push(data.price);
    }
    if (data.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(data.is_active ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return { success: false, error: 'No hay campos para actualizar' };
    }

    updateFields.push('updated_at = ?');
    updateParams.push(new Date().toISOString());
    updateParams.push(presentationId);

    await db.mutate(
      `UPDATE product_presentations SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    const updatedPresentation = await db.selectOne<any>(
      `SELECT * FROM product_presentations WHERE id = ? LIMIT 1`,
      [presentationId]
    );

    // Note: In TanStack Router, we don't use revalidatePath
    return { success: true, data: updatedPresentation };
  } catch (error) {
    console.error('Error en updatePresentation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina (desactiva) una presentaci?n
 */
export async function deletePresentation(presentationId: string) {
  return updatePresentation(presentationId, { is_active: false });
}

/**
 * Activa una presentaci?n
 */
export async function activatePresentation(presentationId: string) {
  return updatePresentation(presentationId, { is_active: true });
}
