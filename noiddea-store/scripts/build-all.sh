#!/bin/bash

# Script para generar instaladores para todas las plataformas
# Este script intenta generar instaladores según la plataforma actual
# Para todas las plataformas, usa GitHub Actions (ver .github/workflows/build.yml)

set -e

echo "🚀 Generando instaladores para todas las plataformas disponibles..."

PLATFORM=$(uname -s)

case "$PLATFORM" in
    Darwin)
        echo "🍎 Detectado macOS - Generando instaladores para Mac..."
        ./scripts/build-mac.sh
        ;;
    Linux)
        echo "🐧 Detectado Linux - Generando instalador para Linux..."
        ./scripts/build-linux.sh
        ;;
    MINGW*|MSYS*|CYGWIN*)
        echo "🪟 Detectado Windows - Generando instalador para Windows..."
        # En Windows, usar el script .bat
        if [ -f "scripts/build-windows.bat" ]; then
            cmd.exe /c scripts\\build-windows.bat
        else
            echo "❌ Error: build-windows.bat no encontrado"
            exit 1
        fi
        ;;
    *)
        echo "❌ Error: Plataforma no soportada: $PLATFORM"
        echo "   Para generar instaladores para todas las plataformas, usa GitHub Actions"
        exit 1
        ;;
esac

echo ""
echo "✅ Proceso completado!"
echo ""
echo "💡 Para generar instaladores para TODAS las plataformas (Mac, Windows, Linux),"
echo "   usa GitHub Actions ejecutando el workflow en .github/workflows/build.yml"
