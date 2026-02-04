import { getNativeAPI } from './native';
import type { DatabaseResult } from '@/types/native';

let schemaInitialized = false;
let schemaInitializationPromise: Promise<void> | null = null;

/**
 * Verifica si la base de datos está disponible
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const native = await getNativeAPI();
  return native?.db !== undefined;
}

/**
 * Inicializa el esquema de la base de datos si no existe
 */
async function initializeSchema(): Promise<void> {
  // Si ya está inicializado o está en proceso, retornar
  if (schemaInitialized) {
    return;
  }
  if (schemaInitializationPromise) {
    return schemaInitializationPromise;
  }

  schemaInitializationPromise = (async () => {
    try {
      const native = await getNativeAPI();
      if (!native?.db) {
        console.error('❌ [initializeSchema] Database API no está disponible');
        throw new Error('Database API no está disponible');
      }

      // Verificar si las tablas ya existen
      const tableCheck = await native.db.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
        []
      );

      const schemaExists = tableCheck.success && tableCheck.data && Array.isArray(tableCheck.data) && tableCheck.data.length > 0;

      // Si el esquema no existe, crearlo
      if (!schemaExists) {
        // Inicializar el esquema completo

        // Dividir el esquema en statements individuales
      const schemaStatements = [
        `CREATE TABLE IF NOT EXISTS schema_migrations (
          version INTEGER PRIMARY KEY,
          applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          avatar_url TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS businesses (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          tax_id TEXT NOT NULL,
          description TEXT,
          category TEXT,
          website TEXT,
          theme TEXT,
          location TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
        `CREATE TABLE IF NOT EXISTS auth_users (
          user_id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          last_login TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS auth_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          token TEXT NOT NULL UNIQUE,
          expires_at TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS businesses_users (
          id TEXT PRIMARY KEY,
          business_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('owner')),
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE(business_id, user_id)
        )`,
        `CREATE TABLE IF NOT EXISTS branches (
          id TEXT PRIMARY KEY,
          business_id TEXT NOT NULL,
          name TEXT NOT NULL,
          location TEXT NOT NULL,
          phone TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS branches_users (
          id TEXT PRIMARY KEY,
          branch_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('cashier')),
          is_active INTEGER NOT NULL DEFAULT 1,
          benefit REAL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE(branch_id, user_id)
        )`,
        `CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          branch_id TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          barcode TEXT,
          sku TEXT,
          brand TEXT,
          cost REAL NOT NULL DEFAULT 0,
          price REAL NOT NULL DEFAULT 0,
          stock REAL,
          bonification REAL,
          expiration TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_by_user_id TEXT,
          created_by_branch_id TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
          FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (created_by_branch_id) REFERENCES branches(id) ON DELETE SET NULL
        )`,
        `CREATE TABLE IF NOT EXISTS product_presentations (
          id TEXT PRIMARY KEY,
          product_id TEXT NOT NULL,
          variant TEXT NOT NULL DEFAULT '',
          units INTEGER NOT NULL DEFAULT 1,
          price REAL,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS suppliers (
          id TEXT PRIMARY KEY,
          business_id TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          ruc TEXT,
          address TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS purchases (
          id TEXT PRIMARY KEY,
          business_id TEXT NOT NULL,
          branch_id TEXT,
          supplier_id TEXT NOT NULL,
          created_by TEXT NOT NULL,
          approved_by TEXT,
          type TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          total REAL NOT NULL DEFAULT 0,
          notes TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          approved_at TEXT,
          received_at TEXT,
          FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
          FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL,
          FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
          FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
        )`,
        `CREATE TABLE IF NOT EXISTS purchase_items (
          id TEXT PRIMARY KEY,
          purchase_id TEXT NOT NULL,
          product_presentation_id TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unit_cost REAL NOT NULL,
          subtotal REAL,
          FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
          FOREIGN KEY (product_presentation_id) REFERENCES product_presentations(id) ON DELETE RESTRICT
        )`,
        `CREATE TABLE IF NOT EXISTS sales (
          id TEXT PRIMARY KEY,
          branch_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          customer TEXT,
          payment_method TEXT NOT NULL CHECK(payment_method IN ('cash', 'card', 'transfer', 'digital_wallet')),
          status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('completed', 'pending', 'cancelled')),
          total REAL NOT NULL DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
        )`,
        `CREATE TABLE IF NOT EXISTS sale_items (
          id TEXT PRIMARY KEY,
          sale_id TEXT NOT NULL,
          product_presentation_id TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          unit_price REAL NOT NULL,
          bonification REAL,
          subtotal REAL,
          FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
          FOREIGN KEY (product_presentation_id) REFERENCES product_presentations(id) ON DELETE RESTRICT
        )`,
        `CREATE TABLE IF NOT EXISTS user_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          branch_id TEXT NOT NULL,
          total_sales REAL NOT NULL DEFAULT 0,
          total_bonus REAL NOT NULL DEFAULT 0,
          payment_totals TEXT NOT NULL DEFAULT '{}',
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          closed_at TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
        )`,
        `CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email)`,
        `CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token)`,
        `CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at)`,
        `CREATE INDEX IF NOT EXISTS idx_products_branch_id ON products(branch_id)`,
        `CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)`,
        `CREATE INDEX IF NOT EXISTS idx_sales_branch_id ON sales(branch_id)`,
        `CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id)`,
        `CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at)`,
        `CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id)`,
        `CREATE INDEX IF NOT EXISTS idx_product_presentations_product_id ON product_presentations(product_id)`,
        `CREATE INDEX IF NOT EXISTS idx_user_sessions_user_branch ON user_sessions(user_id, branch_id)`,
        `CREATE INDEX IF NOT EXISTS idx_user_sessions_closed ON user_sessions(closed_at)`,
      ];

        // Ejecutar todas las statements en una transacción
        const transactionQueries = schemaStatements.map(sql => ({ sql }));
        
        // Agregar timeout para evitar esperas indefinidas
        const transactionPromise = native.db.transaction(transactionQueries);
        const timeoutPromise = new Promise<{ success: boolean; error?: string }>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: La transacción del esquema tardó más de 30 segundos')), 30000)
        );
        
        const transactionResult = await Promise.race([transactionPromise, timeoutPromise]);
        if (!transactionResult.success) {
          console.error('❌ [initializeSchema] Error en transacción:', transactionResult.error);
          throw new Error(transactionResult.error || 'Error ejecutando esquema de base de datos');
        }

        // Si el esquema ya existía, no insertar la migración inicial de nuevo
        try {
          const migrationCheck = await native.db.query(
            'SELECT version FROM schema_migrations WHERE version = 1',
            []
          );
          if (!migrationCheck.success || !migrationCheck.data || !Array.isArray(migrationCheck.data) || migrationCheck.data.length === 0) {
            const insertResult = await native.db.exec(`INSERT INTO schema_migrations (version) VALUES (1)`);
            if (!insertResult.success) {
              console.warn('Error insertando migración inicial:', insertResult.error);
            }
          }
        } catch (error) {
          console.warn('Error insertando migración inicial:', error);
        }
      }

      // Migración 3: Agregar columna location a businesses (ejecutar siempre que sea necesario)
      try {
        const migration3Check = await native.db.query(
          'SELECT version FROM schema_migrations WHERE version = 3',
          []
        );
        if (!migration3Check.success || !migration3Check.data || !Array.isArray(migration3Check.data) || migration3Check.data.length === 0) {
          console.log('🔄 [Migración 3] Agregando columna location a businesses...');
          
          // Verificar si la columna ya existe
          const tableInfo = await native.db.query(
            `PRAGMA table_info(businesses)`,
            []
          );
          
          let hasLocationColumn = false;
          if (tableInfo.success && tableInfo.data && Array.isArray(tableInfo.data)) {
            hasLocationColumn = tableInfo.data.some((col: any) => col.name === 'location');
          }
          
          if (!hasLocationColumn) {
            try {
              const alterResult = await native.db.exec(`ALTER TABLE businesses ADD COLUMN location TEXT`);
              if (!alterResult.success) {
                console.warn('Error agregando columna location:', alterResult.error);
              } else {
                console.log('✅ [Migración 3] Columna location agregada exitosamente');
              }
            } catch (alterError: any) {
              if (alterError?.message?.includes('duplicate column') || alterError?.message?.includes('already exists')) {
                console.log('ℹ️ [Migración 3] Columna location ya existe');
              } else {
                console.error('Error en migración 3:', alterError);
              }
            }
          } else {
            console.log('ℹ️ [Migración 3] Columna location ya existe en businesses');
          }
          
          // Registrar migración 3
          const insertResult = await native.db.exec(`INSERT INTO schema_migrations (version) VALUES (3)`);
          if (!insertResult.success) {
            console.warn('Error registrando migración 3:', insertResult.error);
          } else {
            console.log('✅ [Migración 3] Registrada en schema_migrations');
          }
        } else {
          console.log('ℹ️ [Migración 3] Ya está registrada');
        }
      } catch (error) {
        console.error('❌ Error en migración 3:', error);
        // Intentar agregar la columna location de todas formas si no existe
        try {
          const tableInfo = await native.db.query(
            `PRAGMA table_info(businesses)`,
            []
          );
          let hasLocationColumn = false;
          if (tableInfo.success && tableInfo.data && Array.isArray(tableInfo.data)) {
            hasLocationColumn = tableInfo.data.some((col: any) => col.name === 'location');
          }
          if (!hasLocationColumn) {
            console.log('🔄 [Migración 3] Intentando agregar columna location manualmente...');
            const alterResult = await native.db.exec(`ALTER TABLE businesses ADD COLUMN location TEXT`);
            if (alterResult.success) {
              console.log('✅ [Migración 3] Columna location agregada manualmente');
            }
          }
        } catch (fallbackError) {
          console.error('❌ Error al agregar columna location manualmente:', fallbackError);
        }
      }

      schemaInitialized = true;
    } catch (error) {
      console.error('Error inicializando esquema:', error);
      throw error;
    } finally {
      schemaInitializationPromise = null;
    }
  })();

  return schemaInitializationPromise;
}

/**
 * Ejecuta una query SELECT y retorna los resultados
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const native = await getNativeAPI();
  if (!native?.db) {
    console.error('❌ [query] Database API no está disponible');
    throw new Error(
      'Database API no está disponible. Esta función solo funciona en Tauri. Ejecuta: npm run tauri dev'
    );
  }

  // Inicializar esquema si es necesario
  if (typeof window !== 'undefined' && !schemaInitialized) {
    try {
      await initializeSchema();
    } catch (error) {
      // Si falla la inicialización, continuar de todas formas
      // (puede que el esquema ya esté inicializado)
      console.warn('⚠️ [query] Advertencia al inicializar esquema:', error);
    }
  }

  try {
    // Agregar timeout para evitar esperas indefinidas
    const queryPromise = native.db.query(sql, params);
    const timeoutPromise = new Promise<DatabaseResult<T[]>>((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: La query tardó más de 10 segundos')), 10000)
    );
    
    const result = await Promise.race([queryPromise, timeoutPromise]) as DatabaseResult<T[]>;
    
    if (!result.success) {
      const errorMessage = result.error || 'Error ejecutando query';
      console.error('Query error:', { 
        sql, 
        params, 
        error: errorMessage, 
        result,
        resultType: typeof result,
        resultKeys: result ? Object.keys(result) : []
      });
      throw new Error(errorMessage);
    }

    // Asegurarnos de que data es un array
    if (!result.data) {
      return [];
    }

    // Si data ya es un array, retornarlo directamente
    if (Array.isArray(result.data)) {
      return result.data;
    }

    // Si data no es un array, intentar convertirlo
    return [result.data] as T[];
  } catch (error: any) {
    // Check for specific IPC handler errors
    const errorMsg = error?.message || String(error);
    if (errorMsg.includes('No handler registered')) {
      throw new Error(
        'Los handlers de base de datos no están registrados.\n\n' +
        'SOLUCIÓN:\n' +
        '1. Cierra la aplicación Tauri completamente\n' +
        '2. Ejecuta: npm run tauri dev\n' +
        '3. Espera a que la aplicación Tauri inicie correctamente.\n\n' +
        'Si ya tienes Tauri corriendo, reinícialo para que cargue los handlers.'
      );
    }
    throw error;
  }
}

/**
 * Ejecuta una query y retorna un solo resultado
 */
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Ejecuta una query INSERT, UPDATE o DELETE
 */
export async function execute(sql: string, params: any[] = []): Promise<{ changes: number; lastInsertRowid?: number }> {
  const native = await getNativeAPI();
  if (!native?.db) {
    throw new Error('Database API no está disponible. Ejecuta la aplicación con: npm run tauri dev');
  }

  // Use execute method which calls db:execute handler (uses stmt.run())
  const result = await native.db.execute(sql, params) as DatabaseResult<{ changes: number; lastInsertRowid?: number }>;
  
  if (!result.success) {
    throw new Error(result.error || 'Error ejecutando query');
  }

  return result.data || { changes: 0 };
}

/**
 * Ejecuta múltiples queries en una transacción
 */
export async function transaction(queries: Array<{ sql: string; params?: any[] }>): Promise<any[]> {
  const native = await getNativeAPI();
  if (!native?.db) {
    throw new Error('Database API no está disponible. Ejecuta la aplicación con: npm run tauri dev');
  }

  const result = await native.db.transaction(queries);
  
  if (!result.success) {
    const errorDetails = result.error || 'Error desconocido en transacción';
    throw new Error(`Error en transaction: ${errorDetails}`);
  }

  return result.data || [];
}

/**
 * Genera un ID único (UUID v4 simplificado)
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Convierte un objeto a JSON string de forma segura
 */
export function toJson(value: any): string {
  return JSON.stringify(value);
}

/**
 * Parsea un JSON string de forma segura
 */
export function fromJson<T = any>(json: string): T {
  try {
    return JSON.parse(json);
  } catch {
    return {} as T;
  }
}

/**
 * Convierte un Date a string ISO para SQLite
 */
export function toSqliteDate(date: Date): string {
  return date.toISOString();
}

/**
 * Convierte un string ISO de SQLite a Date
 */
export function fromSqliteDate(dateString: string): Date {
  return new Date(dateString);
}
