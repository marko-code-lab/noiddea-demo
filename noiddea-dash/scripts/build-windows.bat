@echo off
REM Script para generar instalador de Windows
REM Ejecutar desde la raíz del proyecto

echo Generando instalador para Windows...

REM Verificar que Rust está instalado
where rustc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Rust no esta instalado. Por favor instala Rust primero.
    exit /b 1
)

REM Verificar que pnpm está instalado
where pnpm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: pnpm no esta instalado. Por favor instala pnpm primero.
    exit /b 1
)

REM Construir el frontend primero
echo Construyendo frontend...
call pnpm build

REM Generar instalador para Windows
echo Generando instalador para Windows...
set CI=
call pnpm run tauri:build

echo Instalador de Windows generado exitosamente!
echo Los instaladores se encuentran en: src-tauri\target\release\bundle\
