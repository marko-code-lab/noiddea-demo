#!/bin/bash

# Script para generar instaladores de Mac (Apple Silicon e Intel)
# Ejecutar desde la raíz del proyecto

set -e

echo "🍎 Generando instaladores para Mac..."

# Verificar que estamos en macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: Este script solo puede ejecutarse en macOS"
    exit 1
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

# Instalar toolchains necesarios si no están instalados
echo "📦 Verificando toolchains de Rust..."

# Apple Silicon (aarch64-apple-darwin)
if ! rustup target list --installed | grep -q "aarch64-apple-darwin"; then
    echo "📥 Instalando toolchain para Apple Silicon..."
    rustup target add aarch64-apple-darwin
fi

# Intel (x86_64-apple-darwin)
if ! rustup target list --installed | grep -q "x86_64-apple-darwin"; then
    echo "📥 Instalando toolchain para Intel..."
    rustup target add x86_64-apple-darwin
fi

# Construir el frontend primero
echo "🏗️  Construyendo frontend..."
pnpm build

# Generar instalador para Apple Silicon
echo "🔨 Generando instalador para Apple Silicon (M1/M2/M3)..."
unset CI
pnpm run tauri:build -- --target aarch64-apple-darwin

# Generar instalador para Intel
echo "🔨 Generando instalador para Intel..."
unset CI
pnpm run tauri:build -- --target x86_64-apple-darwin

echo "✅ Instaladores de Mac generados exitosamente!"
echo "📦 Los instaladores se encuentran en:"
echo "   - Apple Silicon: src-tauri/target/aarch64-apple-darwin/release/bundle/"
echo "   - Intel: src-tauri/target/x86_64-apple-darwin/release/bundle/"
