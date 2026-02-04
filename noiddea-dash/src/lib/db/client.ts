/**
 * Cliente de base de datos unificado para SQLite
 * Note: Next.js and Tauri-specific code removed
 */

import { query, queryOne, execute, transaction, generateId } from '../database';
import type Database from 'better-sqlite3';

// Para uso en servidor
let serverDb: Database.Database | null = null;

export function setServerDatabase(db: Database.Database | null) {
  serverDb = db;
}

export function getServerDatabase(): Database.Database | null {
  // Solo ejecutar en servidor - nunca intentar inicializar en el cliente
  if (typeof window !== 'undefined') {
    return null;
  }
  
  // Si ya está inicializada, retornarla
  if (serverDb) {
    return serverDb;
  }
  
  // No intentar inicializar aquí para evitar problemas de bundling
  // La inicialización debe hacerse explícitamente desde código del servidor
  return null;
}

/**
 * Cliente de base de datos unificado
 */
export class DatabaseClient {
  /**
   * Ejecuta una query SELECT y retorna todos los resultados
   */
  async select<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const db = getServerDatabase();
    if (db) {
      // Usar better-sqlite3 directamente en servidor
      const stmt = db.prepare(sql);
      return stmt.all(...params) as T[];
    }
    // Si estamos en el cliente (renderer), usar IPC a través de Electron
    if (typeof window !== 'undefined') {
      return query<T>(sql, params);
    }
    // Si estamos en servidor pero no hay DB, no intentar inicializar aquí
    // El servidor debe inicializar la DB explícitamente
    // Esto previene que better-sqlite3 se importe en el cliente
    throw new Error('Database not initialized. Server must initialize database explicitly.');
  }

  /**
   * Ejecuta una query SELECT y retorna un solo resultado
   */
  async selectOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const db = getServerDatabase();
    if (db) {
      const stmt = db.prepare(sql);
      const result = stmt.get(...params) as T | undefined;
      return result || null;
    }
    // Si estamos en el cliente (renderer), usar IPC a través de Electron
    if (typeof window !== 'undefined') {
      return queryOne<T>(sql, params);
    }
    // Si estamos en servidor pero no hay DB, no intentar inicializar aquí
    // El servidor debe inicializar la DB explícitamente
    // Esto previene que better-sqlite3 se importe en el cliente
    return null;
  }

  /**
   * Ejecuta una query INSERT, UPDATE o DELETE
   */
  async mutate(sql: string, params: any[] = []): Promise<{ changes: number; lastInsertRowid?: number }> {
    const db = getServerDatabase();
    if (db) {
      const stmt = db.prepare(sql);
      const result = stmt.run(...params);
      return {
        changes: result.changes,
        lastInsertRowid: result.lastInsertRowid ? Number(result.lastInsertRowid) : undefined,
      };
    }
    // Si estamos en el cliente (renderer), usar IPC a través de Electron
    if (typeof window !== 'undefined') {
      return execute(sql, params);
    }
    // Si estamos en servidor pero no hay DB, no intentar inicializar aquí
    // El servidor debe inicializar la DB explícitamente
    // Esto previene que better-sqlite3 se importe en el cliente
    return { changes: 0 };
  }

  /**
   * Ejecuta múltiples queries en una transacción
   */
  async transact(queries: Array<{ sql: string; params?: any[] }>): Promise<any[]> {
    const db = getServerDatabase();
    if (db) {
      const trans = db.transaction(() => {
        const results: any[] = [];
        for (const q of queries) {
          const stmt = db.prepare(q.sql);
          if (q.sql.trim().toUpperCase().startsWith('SELECT')) {
            results.push(stmt.all(...(q.params || [])));
          } else {
            results.push(stmt.run(...(q.params || [])));
          }
        }
        return results;
      });
      return trans();
    }
    // Si estamos en el cliente (renderer), usar IPC a través de Electron
    if (typeof window !== 'undefined') {
      return transaction(queries);
    }
    // Si estamos en servidor pero no hay DB, no intentar inicializar aquí
    // El servidor debe inicializar la DB explícitamente
    // Esto previene que better-sqlite3 se importe en el cliente
    return [];
  }

  /**
   * Genera un ID único
   */
  generateId(): string {
    return generateId();
  }
}

// Instancia singleton del cliente
let dbClient: DatabaseClient | null = null;

export function getDatabaseClient(): DatabaseClient {
  if (!dbClient) {
    dbClient = new DatabaseClient();
  }
  return dbClient;
}
