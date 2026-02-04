import { readdir, stat, writeFile, mkdir, copyFile, readdir as readdirSync } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { cp } from 'fs/promises';

async function generateIndexHtml() {
  // Try multiple possible locations for assets
  // TanStack Start generates files in dist/client or .output/public
  const possibleAssetDirs = [
    join(process.cwd(), '.output/public/assets'),
    join(process.cwd(), '.output/public'),
    join(process.cwd(), 'dist/client/assets'),
    join(process.cwd(), 'dist/client'),
    join(process.cwd(), 'dist/assets'),
    join(process.cwd(), 'dist'),
  ];
  
  let assetsDir = null;
  let files = [];
  
  // Find the directory that exists and contains JS files
  for (const dir of possibleAssetDirs) {
    try {
      if (existsSync(dir)) {
        const dirFiles = await readdir(dir);
        const hasJsFiles = dirFiles.some(f => f.endsWith('.js'));
        if (hasJsFiles) {
          assetsDir = dir;
          files = dirFiles;
          console.log(`✓ Found assets directory: ${dir}`);
          break;
        }
      }
    } catch (error) {
      // Continue to next directory
      continue;
    }
  }
  
  if (!assetsDir || files.length === 0) {
    console.error('Could not find assets directory with JavaScript files');
    console.error('Searched in:', possibleAssetDirs);
    process.exit(1);
  }
  
  try {
    
    // Find CSS file
    const cssFile = files.find(f => f.endsWith('.css') && (f.startsWith('styles-') || f.startsWith('index-')));
    
    // Find main JS file - TanStack Start typically uses main-*.js as the entry point
    // We'll prefer main-*.js files, and if none exist, use the largest index-*.js
    const jsFiles = files.filter(f => f.endsWith('.js') && !f.includes('legacy'));
    const mainJsFiles = jsFiles.filter(f => f.startsWith('main-'));
    const indexJsFiles = jsFiles.filter(f => f.startsWith('index-'));
    
    let mainJsFile = null;
    
    if (mainJsFiles.length > 0) {
      // Use main-*.js if available (this is the typical entry point)
      mainJsFile = mainJsFiles[0];
    } else if (indexJsFiles.length > 0) {
      // Find the largest index-*.js file as it's likely the main bundle
      const fileStats = await Promise.all(
        indexJsFiles.map(async (f) => {
          const stats = await stat(join(assetsDir, f));
          return { name: f, size: stats.size };
        })
      );
      fileStats.sort((a, b) => b.size - a.size);
      mainJsFile = fileStats[0].name;
    } else if (jsFiles.length > 0) {
      // Fallback: use the largest JS file
      const fileStats = await Promise.all(
        jsFiles.map(async (f) => {
          const stats = await stat(join(assetsDir, f));
          return { name: f, size: stats.size };
        })
      );
      fileStats.sort((a, b) => b.size - a.size);
      mainJsFile = fileStats[0].name;
    }
    
    if (!mainJsFile) {
      console.error('Could not find main JavaScript file');
      console.error('Available files:', files);
      process.exit(1);
    }
    
    // Determine the path prefix based on where assets are located
    const isAssetsSubdir = assetsDir.endsWith('/assets');
    const assetPath = isAssetsSubdir ? '/assets' : '';
    
    const html = `<!DOCTYPE html>
<html lang="en" suppressHydrationWarning>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kapok Preview</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    ${cssFile ? `<link rel="stylesheet" href="${assetPath}/${cssFile}" />` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${assetPath}/${mainJsFile}"></script>
  </body>
</html>`;
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), '.output/public');
    const outputAssetsDir = join(outputDir, 'assets');
    
    try {
      await mkdir(outputDir, { recursive: true });
      await mkdir(outputAssetsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }
    
    // Always copy assets from dist/client to .output/public
    // This ensures Tauri can serve them with correct MIME types
    const distClientDir = join(process.cwd(), 'dist/client');
    if (existsSync(distClientDir)) {
      console.log('📦 Copying files from dist/client to .output/public...');
      
      // Copy assets directory
      const sourceAssetsDir = join(distClientDir, 'assets');
      if (existsSync(sourceAssetsDir)) {
        const sourceFiles = await readdir(sourceAssetsDir);
        for (const file of sourceFiles) {
          const sourcePath = join(sourceAssetsDir, file);
          const destPath = join(outputAssetsDir, file);
          try {
            await copyFile(sourcePath, destPath);
          } catch (error) {
            console.warn(`⚠️  Could not copy asset ${file}:`, error.message);
          }
        }
        console.log(`✓ Copied ${sourceFiles.length} asset files`);
      }
      
      // Copy other files from dist/client root (like favicon, etc.)
      const distFiles = await readdir(distClientDir);
      let copiedCount = 0;
      for (const file of distFiles) {
        // Skip assets directory (already copied) and HTML files (we generate our own)
        if (file === 'assets' || file.endsWith('.html')) continue;
        
        const sourcePath = join(distClientDir, file);
        const destPath = join(outputDir, file);
        try {
          const stats = await stat(sourcePath);
          if (stats.isFile()) {
            await copyFile(sourcePath, destPath);
            copiedCount++;
          }
        } catch (error) {
          console.warn(`⚠️  Could not copy ${file}:`, error.message);
        }
      }
      if (copiedCount > 0) {
        console.log(`✓ Copied ${copiedCount} additional files`);
      }
    } else {
      console.warn('⚠️  dist/client directory not found, assets may not be copied');
    }
    
    const outputPath = join(outputDir, 'index.html');
    await writeFile(outputPath, html, 'utf-8');
    console.log(`✓ Generated index.html`);
    console.log(`  CSS: ${cssFile || 'none'}`);
    console.log(`  JS: ${mainJsFile}`);
    console.log(`  Asset path: ${assetPath || '/'}`);
  } catch (error) {
    console.error('Error generating index.html:', error);
    process.exit(1);
  }
}

generateIndexHtml();
