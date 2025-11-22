import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // GitHub Pages base path - set via VITE_BASE env var or default to '/'
    // For repo pages: use '/repo-name/'
    // For user/organization pages (repo name is username.github.io): use '/'
    const base = process.env.VITE_BASE || '/';
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      preview: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        // Plugin to handle SPA fallback for client-side routing
        {
          name: 'spa-fallback',
          configureServer(server) {
            return () => {
              server.middlewares.use((req, res, next) => {
                // Only handle routes that don't have file extensions and aren't API calls
                // This allows React Router to handle client-side routing
                if (req.url && 
                    !req.url.startsWith('/api') && 
                    !req.url.startsWith('/@') && // Vite internal
                    !req.url.includes('.') && // No file extension
                    req.url !== '/' &&
                    !req.url.startsWith('/src/') &&
                    !req.url.startsWith('/node_modules/')) {
                  // Check if the file exists, if not, serve index.html
                  const urlPath = req.url.split('?')[0];
                  if (!urlPath.includes('.')) {
                    req.url = '/index.html';
                  }
                }
                next();
              });
            };
          }
        },
        // Plugin to copy index.html to 404.html for GitHub Pages SPA routing
        {
          name: 'copy-404',
          closeBundle() {
            const distPath = path.resolve(__dirname, 'dist');
            const indexPath = path.join(distPath, 'index.html');
            const notFoundPath = path.join(distPath, '404.html');
            try {
              copyFileSync(indexPath, notFoundPath);
              console.log('✓ Copied index.html to 404.html for GitHub Pages');
            } catch (err) {
              console.warn('⚠ Could not copy index.html to 404.html:', err);
            }
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      }
    };
});
