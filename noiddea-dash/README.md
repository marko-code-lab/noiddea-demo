# Kapok Preview

Aplicación de gestión de punto de venta (POS) construida con TanStack Start, React, TypeScript, y Tauri.

## Características

- **100% Offline y Local**: La aplicación funciona completamente offline usando SQLite local a través de Tauri IPC
- **Reconocimiento de Voz**: Búsqueda de productos mediante reconocimiento de voz usando la Web Speech API del navegador (funciona localmente)
- **Verificación de Actualizaciones**: Sistema opcional para verificar actualizaciones disponibles (requiere conexión a internet si está configurado)

## Arquitectura

- **Base de Datos**: SQLite local accedida a través de Tauri IPC
- **Frontend**: React + TanStack Router + shadcn/ui
- **Backend**: Tauri (Rust) para operaciones de base de datos y autenticación
- **Almacenamiento**: Todo se guarda localmente en el dispositivo

## Funciones que Requieren Internet

La aplicación está diseñada para funcionar **100% offline**, excepto por:

1. **checkForUpdates**: Verificación opcional de actualizaciones (solo si se configura `VITE_UPDATE_SERVER_URL`)
2. **Speech Recognition**: Puede requerir conexión a internet dependiendo del navegador/implementación, pero funciona principalmente offline

Todas las demás funciones (autenticación, productos, ventas, inventario, etc.) funcionan completamente offline.

## Generación de Instaladores

### Generar Instaladores Localmente

#### macOS (Apple Silicon e Intel)

Para generar instaladores de Mac desde macOS:

```bash
./scripts/build-mac.sh
```

Esto generará:
- Instalador para Apple Silicon (M1/M2/M3) en `src-tauri/target/aarch64-apple-darwin/release/bundle/`
- Instalador para Intel en `src-tauri/target/x86_64-apple-darwin/release/bundle/`

#### Windows

Para generar instalador de Windows desde Windows:

```bash
# Usando PowerShell o CMD
scripts\build-windows.bat
```

O desde WSL/Linux:

```bash
./scripts/build-windows.sh
```

El instalador se generará en `src-tauri/target/release/bundle/`

#### Linux

Para generar instalador de Linux:

```bash
./scripts/build-linux.sh
```

**Dependencias requeridas en Linux:**

- **Ubuntu/Debian:**
  ```bash
  sudo apt-get install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
  ```

- **Fedora:**
  ```bash
  sudo dnf install webkit2gtk3-devel.x86_64 openssl-devel curl wget libappindicator-gtk3 librsvg2-devel
  ```

- **Arch:**
  ```bash
  sudo pacman -S webkit2gtk base-devel curl wget openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg libvips
  ```

El instalador se generará en `src-tauri/target/release/bundle/`

### Generar Todos los Instaladores con GitHub Actions (Recomendado)

La forma más fácil de generar instaladores para todas las plataformas es usar GitHub Actions:

1. **Push de un tag de versión:**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

2. **O ejecutar manualmente el workflow:**
   - Ve a la pestaña "Actions" en GitHub
   - Selecciona "Build Installers"
   - Haz clic en "Run workflow"
   - Elige las plataformas que deseas construir (o "all" para todas)
   - Haz clic en "Run workflow"

El workflow generará instaladores para:
- ✅ macOS (Apple Silicon - M1/M2/M3)
- ✅ macOS (Intel)
- ✅ Windows (x64)
- ✅ Linux (x64)

Los instaladores estarán disponibles como:
- **Artifacts** descargables en la ejecución del workflow
- **Release** (si se ejecuta con un tag) con todos los instaladores adjuntos

### Requisitos Previos

- **Node.js** 20 o superior
- **pnpm** instalado globalmente
- **Rust** y **Cargo** instalados
- Para Mac: Certificados de desarrollador (opcional, para firmar la app)
- Para Windows: Visual Studio Build Tools (si se compila localmente)
- Para Linux: Dependencias del sistema listadas arriba
