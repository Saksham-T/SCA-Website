// Static "build" — produce dist/ as a byte-for-byte copy of the hand-authored
// source, with NO bundling/transformation.
//
// Why: this site is a hand-authored static site — pages load pre-built bundles
// (`assets/sca.bundle.min.css/js`), classic (non-module) scripts
// (`assets/sca-kinetic.js`, …), and reference images/fonts by literal paths.
// `vite build` re-processes and hashes all of that, which makes the built site
// render differently from `npm run dev` (the dev server just serves the raw
// files). Copying the raw files guarantees preview/production look EXACTLY like
// dev. Run via `npm run build`; preview with `npm run preview`.

import fs from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('.', import.meta.url));
const dist = resolve(root, 'dist');

// 1. Clean output.
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// 2. Copy every deployable root HTML page (same filter the old vite input used:
//    skip the Handover exports and the standalone hero mock).
for (const file of fs.readdirSync(root)) {
  if (
    file.endsWith('.html') &&
    !file.includes('Handover') &&
    file !== 'Photo Showcase Hero.html'
  ) {
    fs.copyFileSync(resolve(root, file), resolve(dist, file));
  }
}

// 3. Copy the static asset directories verbatim.
for (const dir of ['assets', 'images']) {
  const src = resolve(root, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, resolve(dist, dir), { recursive: true });
  }
}

// 4. Copy root-level static files (service worker + SEO).
for (const file of ['sw.js', 'robots.txt', 'sitemap.xml']) {
  const src = resolve(root, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, resolve(dist, file));
  }
}

console.log('Static build complete → dist/ (raw copy, identical to dev)');
