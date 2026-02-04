#!/bin/bash

# Script para generar instaladores para todas las plataformas usando GitHub Actions
# Este script te ayuda a configurar y ejecutar el workflow de GitHub Actions

set -e

echo "🚀 Generador de Instaladores para Todas las Plataformas"
echo ""

# Verificar que estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Este directorio no es un repositorio git"
    echo "   Por favor inicializa git primero: git init"
    exit 1
fi

# Verificar que hay un remote configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Advertencia: No hay un remote 'origin' configurado"
    echo "   Para usar GitHub Actions, necesitas:"
    echo "   git remote add origin <url-de-tu-repo>"
    echo ""
    echo "   Alternativamente, puedes generar instaladores localmente:"
    echo "   - Mac: ./scripts/build-mac.sh"
    echo "   - Windows: Ejecutar scripts/build-windows.bat en Windows"
    echo "   - Linux: ./scripts/build-linux.sh en Linux"
    exit 1
fi

echo "✅ Repositorio git detectado"
echo ""

# Mostrar opciones
echo "Opciones para generar instaladores:"
echo ""
echo "1. Crear un tag y hacer push (recomendado para releases)"
echo "2. Ver instrucciones para ejecutar manualmente en GitHub"
echo "3. Ver ubicación de instaladores de Mac ya generados"
echo ""
read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo ""
        echo "📝 Creando tag de versión..."
        read -p "Ingresa la versión (ej: 0.1.0): " version
        
        if [ -z "$version" ]; then
            echo "❌ Error: Versión no puede estar vacía"
            exit 1
        fi
        
        # Verificar que no existe el tag
        if git rev-parse "v$version" > /dev/null 2>&1; then
            echo "⚠️  El tag v$version ya existe"
            read -p "¿Deseas eliminarlo y recrearlo? (s/n): " recreate
            if [ "$recreate" = "s" ] || [ "$recreate" = "S" ]; then
                git tag -d "v$version"
                git push origin ":refs/tags/v$version" 2>/dev/null || true
            else
                echo "Operación cancelada"
                exit 0
            fi
        fi
        
        echo "🏷️  Creando tag v$version..."
        git tag "v$version"
        
        echo "📤 Haciendo push del tag..."
        git push origin "v$version"
        
        echo ""
        echo "✅ Tag creado y pusheado exitosamente!"
        echo ""
        echo "🔗 Ve a GitHub Actions para ver el progreso:"
        echo "   https://github.com/$(git remote get-url origin | sed -E 's/.*github.com[:/](.*)\.git/\1/')/actions"
        echo ""
        echo "Los instaladores se generarán automáticamente y estarán disponibles en:"
        echo "   - Artifacts de la ejecución del workflow"
        echo "   - Release (si está configurado)"
        ;;
    2)
        echo ""
        echo "📋 Instrucciones para ejecutar manualmente en GitHub:"
        echo ""
        echo "1. Ve a tu repositorio en GitHub"
        echo "2. Haz clic en la pestaña 'Actions'"
        echo "3. Selecciona 'Build Installers' en el menú lateral"
        echo "4. Haz clic en 'Run workflow' (botón en la parte superior derecha)"
        echo "5. Selecciona 'all' en el campo 'Platforms to build'"
        echo "6. Haz clic en 'Run workflow'"
        echo ""
        echo "El workflow generará instaladores para:"
        echo "   ✅ macOS (Apple Silicon)"
        echo "   ✅ macOS (Intel)"
        echo "   ✅ Windows (x64)"
        echo "   ✅ Linux (x64)"
        echo ""
        echo "Los instaladores estarán disponibles como artifacts descargables"
        ;;
    3)
        echo ""
        echo "📦 Instaladores de Mac generados:"
        echo ""
        
        DMG_FILE="src-tauri/target/release/bundle/dmg/kapok-preview_0.1.0_aarch64.dmg"
        if [ -f "$DMG_FILE" ]; then
            echo "🍎 Apple Silicon (M1/M2/M3):"
            echo "   Archivo: $DMG_FILE"
            echo "   Tamaño: $(ls -lh "$DMG_FILE" | awk '{print $5}')"
            echo "   Ruta completa: $(realpath "$DMG_FILE")"
            echo ""
            echo "💡 Para instalar:"
            echo "   Abre el archivo .dmg y arrastra la aplicación a la carpeta Aplicaciones"
        else
            echo "⚠️  No se encontró el instalador de Mac"
            echo "   Ejecuta: ./scripts/build-mac.sh"
        fi
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac
