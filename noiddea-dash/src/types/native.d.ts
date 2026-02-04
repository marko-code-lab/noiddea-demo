export interface DatabaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface NativeAPI {
  app: {
    getVersion: () => Promise<string>;
    getPath: (name: string) => Promise<string>;
    restart: () => Promise<void>;
  };
  db: {
    getPath: () => Promise<string>;
    exists: () => Promise<boolean>;
    query: (sql: string, params?: any[]) => Promise<DatabaseResult>;
    execute: (sql: string, params?: any[]) => Promise<DatabaseResult>;
    exec: (sql: string) => Promise<DatabaseResult>;
    transaction: (queries: Array<{ sql: string; params?: any[] }>) => Promise<DatabaseResult>;
  };
  auth: {
    hashPassword: (password: string) => Promise<DatabaseResult<{ hash: string }>>;
    verifyPassword: (password: string, hash: string) => Promise<DatabaseResult<{ isValid: boolean }>>;
    generateToken: (userId: string, email: string) => Promise<DatabaseResult<{ token: string }>>;
  };
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
  };
  script: {
    resetDatabase: () => Promise<string>;
  };
  platform: string;
  isTauri: boolean;
}

export type TauriAPI = NativeAPI;

export {};
