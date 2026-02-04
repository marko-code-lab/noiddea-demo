/**
 * Actions para gestión de sucursales (branches)
 * Migrado a SQLite - Funciona completamente offline
 */
 
import { getServerSession } from '@/lib/session';
import { getDatabaseClient } from '@/lib/db/client';
import { generateId } from '@/lib/database';
import type { Branch } from '@/types';
 
 /**
  * Crea una nueva sucursal para un negocio
  */
 export async function createBranch(data: {
   name: string;
   location: string;
   phone?: string;
 }) {
   try {
     // Validar datos
     if (!data.name || !data.location) {
       return { success: false, error: 'Nombre y ubicación son requeridos' };
     }
 
     const session = await getServerSession();
     if (!session) {
       return { success: false, error: 'Debes estar autenticado' };
     }
 
     const db = getDatabaseClient();
 
     // Obtener el negocio del usuario
     const businessUser = await db.selectOne<{ business_id: string; role: string }>(
       `SELECT business_id, role FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
       [session.userId]
     );
 
     if (!businessUser) {
       return { success: false, error: 'No tienes un negocio asociado' };
     }
 
     // Verificar que tenga permisos (owner)
     if (businessUser.role !== 'owner') {
       return {
         success: false,
         error: 'No tienes permisos para crear sucursales',
       };
     }
 
     // Generar ID para la sucursal
     const branchId = generateId();
 
     // Crear la sucursal
     await db.mutate(
       `INSERT INTO branches (id, business_id, name, location, phone) VALUES (?, ?, ?, ?, ?)`,
       [
         branchId,
         businessUser.business_id,
         data.name.trim(),
         data.location.trim(),
         data.phone?.trim() || null,
       ]
     );
 
     console.log('✅ Sucursal creada:', branchId, data.name.trim());
 
     return {
       success: true,
       branchId,
       branchName: data.name.trim(),
     };
   } catch (error) {
     console.error('❌ Error en createBranch:', error);
     return {
       success: false,
       error: error instanceof Error ? error.message : 'Error desconocido',
     };
   }
 }
 
 /**
  * Actualiza una sucursal existente
  */
 export async function updateBranch(
   branchId: string,
   data: {
     name?: string;
     location?: string;
     phone?: string | null;
   }
 ) {
  try {
     const session = await getServerSession();
     if (!session) {
       return { success: false, error: 'Debes estar autenticado' };
     }
 
     const db = getDatabaseClient();
 
     // Obtener la sucursal para conocer su negocio asociado
     const branch = await db.selectOne<{ id: string; business_id: string }>(
       `SELECT id, business_id FROM branches WHERE id = ? LIMIT 1`,
       [branchId]
     );
 
     if (!branch) {
       return { success: false, error: 'Sucursal no encontrada' };
     }
 
     // Verificar que el usuario tenga permisos (owner del negocio)
     const businessUser = await db.selectOne<{ role: string }>(
       `SELECT role FROM businesses_users WHERE user_id = ? AND business_id = ? AND is_active = 1 LIMIT 1`,
       [session.userId, branch.business_id]
     );
 
     if (!businessUser || businessUser.role !== 'owner') {
       return {
         success: false,
         error: 'No tienes permisos para editar esta sucursal',
       };
     }
 
     // Preparar actualizaciones
     const updates: string[] = [];
     const params: (string | null)[] = [];
 
     if (data.name !== undefined) {
       updates.push('name = ?');
       params.push(data.name.trim());
     }
 
     if (data.location !== undefined) {
       updates.push('location = ?');
       params.push(data.location.trim());
     }
 
     if (data.phone !== undefined) {
       updates.push('phone = ?');
       params.push(data.phone?.trim() || null);
     }
 
     if (updates.length === 0) {
       return { success: false, error: 'No hay datos para actualizar' };
     }
 
     params.push(branchId);
 
     // Actualizar la sucursal
     await db.mutate(
       `UPDATE branches SET ${updates.join(', ')} WHERE id = ?`,
       params
     );
 
     // Obtener la sucursal actualizada
     const updatedBranch = await db.selectOne<Branch>(
       `SELECT * FROM branches WHERE id = ?`,
       [branchId]
     );
 
    // Note: In TanStack Router, we don't use revalidatePath
 
     return {
       success: true,
       branch: updatedBranch,
     };
   } catch (error) {
     console.error('❌ Error en updateBranch:', error);
     return {
       success: false,
       error: error instanceof Error ? error.message : 'Error desconocido',
     };
   }
 }
 
 /**
  * Obtiene todas las sucursales de un negocio
  */
 export async function getBranches() {
   try {
     const session = await getServerSession();
     if (!session) {
       return { success: false, error: 'Debes estar autenticado', branches: [] };
     }

     const db = getDatabaseClient();

     // Obtener el negocio del usuario
     const businessUser = await db.selectOne<{ business_id: string }>(
       `SELECT business_id FROM businesses_users WHERE user_id = ? AND is_active = 1 LIMIT 1`,
       [session.userId]
     );

     if (!businessUser) {
       return {
         success: false,
         error: 'No tienes un negocio asociado',
         branches: [],
       };
     }

     // Obtener sucursales del negocio
     const branches = await db.select<Branch>(
       `SELECT * FROM branches WHERE business_id = ? ORDER BY created_at DESC`,
       [businessUser.business_id]
     );

     return {
       success: true,
       branches: branches || [],
     };
   } catch (error) {
     console.error('❌ Error en getBranches:', error);
     return {
       success: false,
       error: error instanceof Error ? error.message : 'Error desconocido',
       branches: [],
     };
   }
 }
