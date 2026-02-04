/**
 * Utilidad para diagnosticar y validar la conexión a la base de datos de com.noiddea.dash
 * 
 * Uso:
 * import { diagnoseDatabase } from '@/lib/database-diagnostics'
 * await diagnoseDatabase()
 */

import { getNativeAPI } from './native';

export interface DatabaseDiagnostics {
  isAvailable: boolean;
  dbPath: string | null;
  dbExists: boolean;
  canConnect: boolean;
  schemaInitialized: boolean;
  tables: string[];
  error: string | null;
}

/**
 * Realiza un diagnóstico completo de la base de datos
 */
export async function diagnoseDatabase(): Promise<DatabaseDiagnostics> {
  const result: DatabaseDiagnostics = {
    isAvailable: false,
    dbPath: null,
    dbExists: false,
    canConnect: false,
    schemaInitialized: false,
    tables: [],
    error: null,
  };

  try {
    const native = await getNativeAPI();

    // 1. Verificar disponibilidad
    result.isAvailable = native?.db !== undefined;
    if (!result.isAvailable) {
      result.error = 'Database API no disponible';
      return result;
    }

    // 2. Obtener ruta de la base de datos
    const pathResult = await native.db.getPath();
    if (pathResult.success && pathResult.data) {
      result.dbPath = pathResult.data;
    } else {
      result.error = pathResult.error || 'No se pudo obtener la ruta de la BD';
      return result;
    }

    // 3. Verificar existencia del archivo
    const existsResult = await native.db.exists();
    result.dbExists = existsResult.success && existsResult.data === true;

    // 4. Intentar conexión y obtener tablas
    const tablesQuery = `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`;
    const tablesResult = await native.db.query(tablesQuery, []);
    result.canConnect = tablesResult.success;

    if (result.canConnect && tablesResult.data) {
      result.tables = (tablesResult.data as any[]).map((row) => row.name);
      result.schemaInitialized = result.tables.length > 0;
    }

    // 5. Log de diagnóstico
    console.log('📊 [Database Diagnostics]');
    console.log(`   ✅ API Available: ${result.isAvailable}`);
    console.log(`   📁 Path: ${result.dbPath}`);
    console.log(`   💾 Exists: ${result.dbExists}`);
    console.log(`   🔗 Connected: ${result.canConnect}`);
    console.log(`   🏗️  Schema: ${result.schemaInitialized}`);
    if (result.tables.length > 0) {
      console.log(`   📋 Tables: ${result.tables.join(', ')}`);
    }

    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error('❌ [Database Diagnostics Error]', result.error);
    return result;
  }
}

/**
 * Verifica si está conectado a la BD correcta (com.noiddea.dash)
 */
export async function verifyDashDatabase(): Promise<boolean> {
  const diag = await diagnoseDatabase();

  if (!diag.dbPath) {
    console.error('❌ No se puede determinar la ruta de la BD');
    return false;
  }

  const isDashDatabase = diag.dbPath.includes('com.noiddea.dash');
  if (isDashDatabase) {
    console.log('✅ Conectado correctamente a com.noiddea.dash');
  } else {
    console.warn('⚠️  Conectado a:', diag.dbPath);
  }

  return isDashDatabase;
}
