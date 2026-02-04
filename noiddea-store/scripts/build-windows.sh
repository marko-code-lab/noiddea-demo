#!/bin/bash

# Script para generar instalador de Windows (desde WSL o Linux con cross-compilation)
# Ejecutar desde la raíz del proyecto

set -e

echo "🪟 Generando instalador para Windows..."

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

# Instalar toolchain para Windows si no está instalado
echo "📦 Verificando toolchain de Rust para Windows..."

if ! rustup target list --installed | grep -q "x86_64-pc-windows-msvc"; then
    echo "📥 Instalando toolchain para Windows (x86_64-pc-windows-msvc)..."
    rustup target add x86_64-pc-windows-msvc
fi

# Nota: Para cross-compilation desde Linux/Mac a Windows, necesitas:
# - mingw-w64 (para GNU toolchain) o
# - wine (para MSVC toolchain) o
# - Usar GitHub Actions (recomendado)

echo "⚠️  Nota: Para generar instaladores de Windows desde Mac/Linux, se recomienda usar GitHub Actions."
echo "   Alternativamente, puedes ejecutar este script en Windows o WSL."

# Construir el frontend primero
echo "🏗️  Construyendo frontend..."
pnpm build

# Intentar generar instalador (puede fallar si no hay toolchain de Windows configurado)
echo "🔨 Generando instalador para Windows..."
unset CI
pnpm run tauri:build -- --target x86_64-pc-windows-msvc || {
    echo "❌ Error: No se pudo generar el instalador. Por favor ejecuta este script en Windows o usa GitHub Actions."
    exit 1
}

echo "✅ Instalador de Windows generado exitosamente!"
echo "📦 Los instaladores se encuentran en: src-tauri/target/x86_64-pc-windows-msvc/release/bundle/"
