/**
 * Inicialización de base de datos SQLite para servidor
 * Se ejecuta solo en el servidor, no en el cliente
 * 
 * Note: Next.js and Tauri-specific code removed
 */

// Solo ejecutar en el servidor
if (typeof window !== 'undefined') {
  throw new Error('server-init.ts solo puede ejecutarse en el servidor');
}

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { setServerDatabase } from './client';

let serverDbInstance: Database.Database | null = null;

/**
 * Obtiene la ruta de la base de datos (misma que Electron)
 * Usa la misma ubicación que Electron para que toda la app use la misma DB
 */
function getElectronDatabasePath(): string {
  const homeDir = os.homedir();
  const platform = process.platform;
  
  let electronUserDataPath: string;
  if (platform === 'darwin') {
    electronUserDataPath = path.join(homeDir, 'Library', 'Application Support');
  } else if (platform === 'win32') {
    electronUserDataPath = path.join(homeDir, 'AppData', 'Roaming');
  } else {
    // Linux
    electronUserDataPath = path.join(homeDir, '.config');
  }
  
  // Usar el mismo nombre de app que Electron
  const appName = 'kapok-pre';
  const dbDir = path.join(electronUserDataPath, appName, 'data');
  
  // Asegurar que el directorio existe
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  return path.join(dbDir, 'kapok.db');
}

/**
 * Obtiene o crea la instancia de base de datos para el servidor
 * USA LA MISMA UBICACIÓN QUE ELECTRON para que toda la app use la misma DB
 */
export function initializeServerDatabase(): Database.Database {
  // Si ya está inicializada, retornarla
  if (serverDbInstance) {
    return serverDbInstance;
  }
  
  // Usar la misma ubicación que Electron
  const dbPath = getElectronDatabasePath();
  console.log('[initializeServerDatabase] Using Electron database path:', dbPath);

  try {
    serverDbInstance = new Database(dbPath);
    serverDbInstance.pragma('journal_mode = WAL');
    serverDbInstance.pragma('foreign_keys = ON');
    // Optimización puntual para Windows: aumentar cache size
    try {
      serverDbInstance.pragma('cache_size = -8192'); // 8MB cache
    } catch (e) {
      // Ignorar errores, no crítico
    }
    
    // Inicializar esquema si es necesario
    initializeSchema(serverDbInstance);
    
    setServerDatabase(serverDbInstance);
    
    return serverDbInstance;
  } catch (error: any) {
    // Note: Tauri-specific error handling removed
    throw error;
  }
}

/**
 * Inicializa el esquema de la base de datos si no existe
 */
function initializeSchema(db: Database.Database): void {
  // Verificar si las tablas ya existen
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='users'
  `).get();

  if (tableExists) {
    return; // El esquema ya está inicializado
  }

  // Inicializar el esquema completo
  console.log('Inicializando esquema de base de datos...');
  
  // Crear tabla de versiones de migración
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Crear todas las tablas
  db.exec(`
    -- Tabla de usuarios
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Tabla de negocios
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tax_id TEXT NOT NULL,
      description TEXT,
      category TEXT,
      website TEXT,
      theme TEXT,
      location TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Tabla de autenticación (almacena passwords hasheadas)
    CREATE TABLE IF NOT EXISTS auth_users (
      user_id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tabla de sesiones activas
    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tabla de relación usuarios-negocios
    CREATE TABLE IF NOT EXISTS businesses_users (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner')),
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(business_id, user_id)
    );

    -- Tabla de sucursales
    CREATE TABLE IF NOT EXISTS branches (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    -- Tabla de relación usuarios-sucursales
    CREATE TABLE IF NOT EXISTS branches_users (
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
    );

    -- Tabla de productos
    CREATE TABLE IF NOT EXISTS products (
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
    );

    -- Tabla de presentaciones de productos
    CREATE TABLE IF NOT EXISTS product_presentations (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      variant TEXT NOT NULL DEFAULT '',
      units INTEGER NOT NULL DEFAULT 1,
      price REAL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- Tabla de proveedores
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      ruc TEXT,
      address TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    );

    -- Tabla de compras
    CREATE TABLE IF NOT EXISTS purchases (
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
    );

    -- Tabla de items de compra
    CREATE TABLE IF NOT EXISTS purchase_items (
      id TEXT PRIMARY KEY,
      purchase_id TEXT NOT NULL,
      product_presentation_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_cost REAL NOT NULL,
      subtotal REAL,
      FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
      FOREIGN KEY (product_presentation_id) REFERENCES product_presentations(id) ON DELETE RESTRICT
    );

    -- Tabla de ventas
    CREATE TABLE IF NOT EXISTS sales (
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
    );

    -- Tabla de items de venta
    CREATE TABLE IF NOT EXISTS sale_items (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      product_presentation_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      bonification REAL,
      subtotal REAL,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (product_presentation_id) REFERENCES product_presentations(id) ON DELETE RESTRICT
    );

    -- Tabla de sesiones de usuario
    CREATE TABLE IF NOT EXISTS user_sessions (
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
    );

    -- Índices para mejorar rendimiento
    CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_products_branch_id ON products(branch_id);
    CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_sales_branch_id ON sales(branch_id);
    CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
    CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
    CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
    CREATE INDEX IF NOT EXISTS idx_product_presentations_product_id ON product_presentations(product_id);
    CREATE INDEX IF NOT EXISTS idx_user_sessions_user_branch ON user_sessions(user_id, branch_id);
    CREATE INDEX IF NOT EXISTS idx_user_sessions_closed ON user_sessions(closed_at);
  `);

  // Insertar versión de migración inicial
  try {
    const versionExists = db.prepare('SELECT version FROM schema_migrations WHERE version = 1').get();
    if (!versionExists) {
      db.exec(`INSERT INTO schema_migrations (version) VALUES (1)`);
    }
  } catch (error) {
    // Si ya existe, no hacer nada
  }

  // Migración: Asegurar que la columna ruc existe en tabla suppliers
  // Esta migración se ejecuta siempre para asegurar que la columna existe
  try {
    // Verificar si la tabla suppliers existe
    const suppliersTableExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='suppliers'
    `).get();
    
    if (suppliersTableExists) {
      // Verificar estructura de la tabla suppliers
      const tableInfo = db.prepare(`PRAGMA table_info(suppliers)`).all() as Array<{ name: string; type: string }>;
      const hasEmailColumn = tableInfo.some(col => col.name === 'email');
      const hasRucColumn = tableInfo.some(col => col.name === 'ruc');

      if (!hasRucColumn) {
        console.log('🔄 [Migración 2] Agregando columna ruc a suppliers...');
        
        try {
          // Agregar columna ruc
          db.exec(`ALTER TABLE suppliers ADD COLUMN ruc TEXT`);
          
          // Si existe email, copiar datos de email a ruc
          if (hasEmailColumn) {
            console.log('🔄 [Migración 2] Copiando datos de email a ruc...');
            db.exec(`UPDATE suppliers SET ruc = email WHERE email IS NOT NULL AND (ruc IS NULL OR ruc = '')`);
          }
          
          console.log('✅ [Migración 2] Columna ruc agregada exitosamente');
        } catch (alterError: any) {
          // Si la columna ya existe (error de SQLite), ignorar
          if (alterError?.message?.includes('duplicate column') || alterError?.message?.includes('already exists')) {
            console.log('ℹ️ [Migración 2] Columna ruc ya existe');
          } else {
            throw alterError;
          }
        }
      } else {
        console.log('ℹ️ [Migración 2] Columna ruc ya existe en suppliers');
      }
    }
    
    // Registrar migración 2 si no está registrada
    try {
      const migration2Exists = db.prepare('SELECT version FROM schema_migrations WHERE version = 2').get();
      if (!migration2Exists) {
        db.exec(`INSERT INTO schema_migrations (version) VALUES (2)`);
        console.log('✅ [Migración 2] Registrada en schema_migrations');
      }
    } catch (migrationError) {
      // Si ya está registrada, ignorar
      console.log('ℹ️ [Migración 2] Ya está registrada');
    }
  } catch (error) {
    console.error('❌ Error en migración 2:', error);
    // Intentar agregar la columna ruc de todas formas si no existe
    try {
      const tableInfo = db.prepare(`PRAGMA table_info(suppliers)`).all() as Array<{ name: string; type: string }>;
      const hasRucColumn = tableInfo.some(col => col.name === 'ruc');
      if (!hasRucColumn) {
        console.log('🔄 [Migración 2] Intentando agregar columna ruc manualmente...');
        db.exec(`ALTER TABLE suppliers ADD COLUMN ruc TEXT`);
        console.log('✅ [Migración 2] Columna ruc agregada manualmente');
      }
    } catch (fallbackError) {
      console.error('❌ Error al agregar columna ruc manualmente:', fallbackError);
    }
  }

  // Migración 3: Agregar columna location a businesses
  try {
    const migration3Exists = db.prepare('SELECT version FROM schema_migrations WHERE version = 3').get();
    if (!migration3Exists) {
      console.log('🔄 [Migración 3] Agregando columna location a businesses...');
      
      // Verificar si la columna ya existe
      const tableInfo = db.prepare(`PRAGMA table_info(businesses)`).all() as Array<{ name: string; type: string }>;
      const hasLocationColumn = tableInfo.some(col => col.name === 'location');
      
      if (!hasLocationColumn) {
        try {
          db.exec(`ALTER TABLE businesses ADD COLUMN location TEXT`);
          console.log('✅ [Migración 3] Columna location agregada exitosamente');
        } catch (alterError: any) {
          if (alterError?.message?.includes('duplicate column') || alterError?.message?.includes('already exists')) {
            console.log('ℹ️ [Migración 3] Columna location ya existe');
          } else {
            throw alterError;
          }
        }
      } else {
        console.log('ℹ️ [Migración 3] Columna location ya existe en businesses');
      }
      
      // Registrar migración 3
      db.exec(`INSERT INTO schema_migrations (version) VALUES (3)`);
      console.log('✅ [Migración 3] Registrada en schema_migrations');
    } else {
      console.log('ℹ️ [Migración 3] Ya está registrada');
    }
  } catch (error) {
    console.error('❌ Error en migración 3:', error);
    // Intentar agregar la columna location de todas formas si no existe
    try {
      const tableInfo = db.prepare(`PRAGMA table_info(businesses)`).all() as Array<{ name: string; type: string }>;
      const hasLocationColumn = tableInfo.some(col => col.name === 'location');
      if (!hasLocationColumn) {
        console.log('🔄 [Migración 3] Intentando agregar columna location manualmente...');
        db.exec(`ALTER TABLE businesses ADD COLUMN location TEXT`);
        console.log('✅ [Migración 3] Columna location agregada manualmente');
      }
    } catch (fallbackError) {
      console.error('❌ Error al agregar columna location manualmente:', fallbackError);
    }
  }

  console.log('✅ Esquema de base de datos inicializado correctamente');
}

/**
 * Cierra la conexión de base de datos del servidor
 */
export function closeServerDatabase(): void {
  if (serverDbInstance) {
    serverDbInstance.close();
    serverDbInstance = null;
    setServerDatabase(null as any);
  }
}

/**
 * Verifica si la base de datos está disponible
 */
export function isDatabaseAvailable(): boolean {
  if (typeof window !== 'undefined') {
    // In client, database availability depends on Electron IPC
    return true; // Assume available if in browser context
  }
  
  // En el servidor, verificar si tenemos una instancia directa
  return serverDbInstance !== null;
}

