import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Mapeo de rutas a páginas
const routesToMigrate = [
  { from: 'src/routes/dashboard/index.tsx', to: 'src/pages/dashboard/index.tsx' },
  { from: 'src/routes/dashboard/team.tsx', to: 'src/pages/dashboard/team.tsx' },
  { from: 'src/routes/dashboard/products.tsx', to: 'src/pages/dashboard/products.tsx' },
  { from: 'src/routes/dashboard/customers.tsx', to: 'src/pages/dashboard/customers.tsx' },
  { from: 'src/routes/dashboard/sessions.tsx', to: 'src/pages/dashboard/sessions.tsx' },
  { from: 'src/routes/dashboard/suppliers.tsx', to: 'src/pages/dashboard/suppliers.tsx' },
  { from: 'src/routes/dashboard/settings.tsx', to: 'src/pages/dashboard/settings.tsx' },
  { from: 'src/routes/dashboard/subscription.tsx', to: 'src/pages/dashboard/subscription.tsx' },
  { from: 'src/routes/dashboard/purchases/index.tsx', to: 'src/pages/dashboard/purchases/index.tsx' },
  { from: 'src/routes/dashboard/purchases/create.tsx', to: 'src/pages/dashboard/purchases/create.tsx' },
];

function migrateRoute(routePath, pagePath) {
  const fullRoutePath = join(projectRoot, routePath);
  const fullPagePath = join(projectRoot, pagePath);

  try {
    let content = readFileSync(fullRoutePath, 'utf-8');

    // Remover imports de TanStack Router
    content = content.replace(/import\s+{[^}]*createFileRoute[^}]*}\s+from\s+['"]@tanstack\/react-router['"];?\s*/g, '');
    content = content.replace(/import\s+{[^}]*Outlet[^}]*}\s+from\s+['"]@tanstack\/react-router['"];?\s*/g, '');
    content = content.replace(/import\s+{[^}]*Link[^}]*}\s+from\s+['"]@tanstack\/react-router['"];?\s*/g, '');

    // Agregar imports de React Router si se necesita
    if (content.includes('<Link') || content.includes('Link ')) {
      const hasLinkImport = /import.*Link.*from\s+['"]react-router-dom['"]/.test(content);
      if (!hasLinkImport) {
        // Agregar import de Link
        const firstImport = content.match(/^import .*/m);
        if (firstImport) {
          content = content.replace(firstImport[0], `import { Link } from 'react-router-dom';\n${firstImport[0]}`);
        }
      }
    }

    // Remover export const Route = createFileRoute...
    content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute\([^)]*\)\({[^}]*component:\s*(\w+),?[^}]*}\);?\s*/g, '');

    // Cambiar función de componente a exportación nombrada
    const componentMatch = content.match(/function\s+(\w+Page|\w+Layout|\w+Index)\s*\(/);
    if (componentMatch) {
      const componentName = componentMatch[1];
      content = content.replace(`function ${componentName}(`, `export function ${componentName}(`);
    }

    // Remover <Outlet /> si existe (será manejado por React Router en layout)
    // No lo removemos si está en un layout específico

    // Crear directorio si no existe
    const pageDir = dirname(fullPagePath);
    if (!existsSync(pageDir)) {
      mkdirSync(pageDir, { recursive: true });
    }

    // Escribir archivo
    writeFileSync(fullPagePath, content, 'utf-8');
    console.log(`✓ Migrated: ${routePath} -> ${pagePath}`);
  } catch (error) {
    console.error(`✗ Failed to migrate ${routePath}:`, error.message);
  }
}

function existsSync(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

// Ejecutar migración
console.log('Starting route migration...\n');
routesToMigrate.forEach(({ from, to }) => {
  migrateRoute(from, to);
});
console.log('\nMigration complete!');
