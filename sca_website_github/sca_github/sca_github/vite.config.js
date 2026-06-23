import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const input = {};
const files = fs.readdirSync(__dirname);

files.forEach(file => {
  if (file.endsWith('.html') && file !== 'Photo Showcase Hero.html') { // Exclude draft/temp files if needed, or include everything
    const name = file.replace(/\.html$/, '');
    input[name] = resolve(__dirname, file);
  }
});

export default defineConfig({
  plugins: [
    {
      name: 'vite-plugin-debug-log',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          console.log(`[Vite Middleware] Request: ${req.method} ${req.url}`);
          if (req.url.startsWith('/api/debug-log') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              fs.appendFileSync(resolve(__dirname, 'debug_slides.log'), body + '\n', 'utf8');
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end('ok');
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input
    }
  }
});
