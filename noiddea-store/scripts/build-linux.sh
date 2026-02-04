#!/bin/bash

# Script para generar instalador de Linux
# Ejecutar desde la raíz del proyecto

set -e

echo "🐧 Generando instalador para Linux..."

# Verificar que estamos en Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "⚠️  Advertencia: Este script está diseñado para ejecutarse en Linux"
    echo "   Si estás en Mac/Windows, considera usar GitHub Actions"
fi

# Verificar que Rust está instalado
if ! command -v rustc &> /dev/null; then
    echo "❌ Error: Rust no está instalado. Por favor instala Rust primero."
    exit 1
fi

# Verificar que pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm no está instalado. Por favor instala pnpm primero."
    exit 1
fi

# Verificar dependencias del sistema para Tauri en Linux
echo "📦 Verificando dependencias del sistema..."

MISSING_DEPS=()

if ! pkg-config --exists webkit2gtk-4.1 2>/dev/null; then
    MISSING_DEPS+=("webkit2gtk-4.1")
fi

if ! pkg-config --exists gtk+-3.0 2>/dev/null; then
    MISSING_DEPS+=("gtk+-3.0")
fi

if ! pkg-config --exists libappindicator3 2>/dev/null; then
    MISSING_DEPS+=("libappindicator3")
fi

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo "❌ Faltan dependencias del sistema:"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "   - $dep"
    done
    echo ""
    echo "Por favor instala las dependencias:"
    echo "  Ubuntu/Debian: sudo apt-get install libwebkit2gtk-4.1-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev"
    echo "  Fedora: sudo dnf install webkit2gtk3-devel.x86_64 openssl-devel curl wget libappindicator-gtk3 librsvg2-devel"
    echo "  Arch: sudo pacman -S webkit2gtk base-devel curl wget openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg libvips"
    exit 1
fi

# Construir el frontend primero
echo "🏗️  Construyendo frontend..."
pnpm build

# Generar instalador para Linux
echo "🔨 Generando instalador para Linux..."
unset CI
pnpm run tauri:build

echo "✅ Instalador de Linux generado exitosamente!"
echo "📦 Los instaladores se encuentran en: src-tauri/target/release/bundle/"
