import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function fixSsrConfig() {
  const routeTreePath = join(process.cwd(), 'src/routeTree.gen.ts');
  
  try {
    let content = await readFile(routeTreePath, 'utf-8');
    const originalContent = content;
    
    // Replace ssr: true with ssr: false for Tauri (SPA mode)
    // This needs to match the exact format in routeTree.gen.ts
    content = content.replace(/ssr:\s*true/g, 'ssr: false');
    
    // Also ensure the Register interface has ssr: false
    // The Register interface is at the end of the file
    if (content.includes("interface Register")) {
      content = content.replace(/ssr:\s*true/g, 'ssr: false');
    }
    
    // Also check for any other SSR-related settings
    content = content.replace(/ssr:\s*true/g, 'ssr: false');
    
    // Only write if content changed
    if (content !== originalContent) {
      await writeFile(routeTreePath, content, 'utf-8');
      console.log('✓ Fixed SSR configuration in routeTree.gen.ts (set to false for SPA mode)');
      console.log('⚠️  Note: You may need to rebuild if this file was already compiled');
    } else {
      console.log('✓ SSR configuration already correct (ssr: false)');
    }
  } catch (error) {
    console.error('Error fixing SSR configuration:', error);
    // Don't exit with error code - allow build to continue
    // The routeTree may not exist yet or may be in a different location
    console.warn('⚠️  Warning: Could not fix SSR config, but continuing build...');
  }
}

fixSsrConfig();
