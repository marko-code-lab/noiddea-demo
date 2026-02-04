#!/usr/bin/env node

/**
 * Script para resetear la base de datos local de Tauri
 * Elimina los archivos de base de datos (database.db, database.db-wal, database.db-shm)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      log(`✓ Eliminado: ${filePath}`, 'green');
      return true;
    }
    return false;
  } catch (error) {
    log(`✗ Error al eliminar ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function deleteDatabaseFiles(dbDir) {
  if (!fs.existsSync(dbDir)) {
    return 0;
  }

  const dbFiles = [
    'database.db',
    'database.db-wal',
    'database.db-shm'
  ];

  let deleted = 0;
  dbFiles.forEach((fileName) => {
    const filePath = path.join(dbDir, fileName);
    if (deleteFile(filePath)) {
      deleted++;
    }
  });

  return deleted;
}

function getTauriAppIdentifier() {
  // Try to get app identifier from tauri.conf.json
  const tauriConfigPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json');
  let appIdentifier = 'com.tauri.dev'; // Default fallback

  try {
    if (fs.existsSync(tauriConfigPath)) {
      const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));
      if (tauriConfig.identifier) {
        appIdentifier = tauriConfig.identifier;
      }
    }
  } catch (error) {
    log(`⚠️  No se pudo leer tauri.conf.json: ${error.message}`, 'yellow');
  }

  return appIdentifier;
}

function getTauriAppDataPath() {
  const platform = process.platform;
  const homeDir = os.homedir();
  const appIdentifier = getTauriAppIdentifier();

  // Tauri usa app_data_dir() que varía según la plataforma
  if (platform === 'darwin') {
    // macOS: ~/Library/Application Support/{identifier}
    return path.join(homeDir, 'Library', 'Application Support', appIdentifier);
  } else if (platform === 'win32') {
    // Windows: %APPDATA%\{identifier}
    return path.join(homeDir, 'AppData', 'Roaming', appIdentifier);
  } else {
    // Linux: ~/.config/{identifier}
    return path.join(homeDir, '.config', appIdentifier);
  }
}

function main() {
  log('\n🗑️  Limpiando base de datos local de Tauri...\n', 'blue');

  let totalDeleted = 0;
  const platform = process.platform;
  const appIdentifier = getTauriAppIdentifier();

  // 1. Base de datos de Tauri (app_data_dir)
  const tauriAppDataPath = getTauriAppDataPath();
  
  log(`📍 Ubicación Tauri (${platform}):`, 'yellow');
  log(`  App Identifier: ${appIdentifier}`, 'yellow');
  log(`  Buscando en: ${tauriAppDataPath}`, 'yellow');
  
  const deleted = deleteDatabaseFiles(tauriAppDataPath);
  totalDeleted += deleted;

  if (deleted === 0) {
    log(`  No se encontraron archivos de base de datos en: ${tauriAppDataPath}`, 'yellow');
  } else {
    log(`  ✓ Encontrado y eliminado ${deleted} archivo(s)`, 'green');
  }

  // Resumen
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  if (totalDeleted > 0) {
    log(`✅ Base de datos limpiada correctamente (${totalDeleted} archivo(s) eliminado(s))`, 'green');
    log('\n💡 La próxima vez que ejecutes la aplicación Tauri, se creará una base de datos nueva.', 'yellow');
  } else {
    log('ℹ️  No se encontraron archivos de base de datos para eliminar.', 'yellow');
    log('   La base de datos puede no haberse creado aún.', 'yellow');
    log(`   Ubicación esperada: ${tauriAppDataPath}`, 'yellow');
  }
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');
}

// Ejecutar
main();
