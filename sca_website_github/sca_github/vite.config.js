import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const input = {};
const files = fs.readdirSync(__dirname);

files.forEach(file => {
  if (
    file.endsWith('.html') &&
    !file.includes('Handover') &&
    file !== 'Photo Showcase Hero.html'
  ) {
    const name = file.replace(/\.html$/, '');
    input[name] = resolve(__dirname, file);
  }
});

export default defineConfig({
  build: {
    rollupOptions: {
      input
    }
  }
});
