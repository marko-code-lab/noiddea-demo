import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    viteReact(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
  ],
  // Configure for Tauri
  clearScreen: false,
  server: {
    port: 3000,
    strictPort: true,
    watch: {
      // Tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  // Externalize better-sqlite3 for Tauri (it will be loaded at runtime)
  optimizeDeps: {
    exclude: ['better-sqlite3'],
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Preservar nombres de archivos .lottie para que se puedan encontrar en Windows
          // Usar hash solo para cache busting, pero mantener el nombre base
          if (assetInfo.name && assetInfo.name.endsWith('.lottie')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Asegurar que los assets se copien correctamente
    copyPublicDir: true,
  },
})

export default config