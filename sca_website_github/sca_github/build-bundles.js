const fs = require('fs');
const path = require('path');

let Terser;
try {
  Terser = require('terser');
} catch (e) {
  try {
    // Try resolving from the sca_github subfolder if not found in root
    Terser = require(path.resolve(__dirname, 'sca_github/node_modules/terser'));
  } catch (err) {
    console.error("Error: Could not load 'terser' package.");
    console.error("Please run 'npm install' in the 'sca_github' directory.");
    process.exit(1);
  }
}

const JS_FILES = [
  'sca.js',
  'sca-kinetic.js',
  'sca-about.js',
  'sca-deck.js',
  'sca-livebuild.js'
];

const CSS_FILES = [
  'sca-fonts.css',
  'sca.css',
  'sca-extras.css',
  'sca-kinetic.css',
  'sca-hero.css',
  'sca-clients.css',
  'sca-about.css',
  'sca-deck.css',
  'sca-web.css',
  'sca-livebuild.css',
  'sca-dark.css',
  'sca-footer.css',
  'sca-mobile.css'
];

const assetsDir = path.resolve(__dirname, 'frontend/assets');
const targetJsBundle = path.join(assetsDir, 'sca.bundle.min.js');
const targetCssBundle = path.join(assetsDir, 'sca.bundle.min.css');

async function build() {
  console.log("=== Building JS Bundle ===");
  try {
    let jsContent = "";
    for (const file of JS_FILES) {
      const filePath = path.join(assetsDir, file);
      console.log(`Reading JS: ${file}`);
      jsContent += fs.readFileSync(filePath, 'utf8') + "\n";
    }

    console.log("Minifying JS...");
    const minifiedJs = await Terser.minify(jsContent, {
      compress: {
        dead_code: true,
        global_defs: {
          DEBUG: false
        }
      },
      mangle: true
    });

    if (minifiedJs.error) {
      throw minifiedJs.error;
    }

    fs.writeFileSync(targetJsBundle, minifiedJs.code, 'utf8');
    console.log(`✓ JS Bundle built successfully: ${targetJsBundle} (${minifiedJs.code.length} bytes)`);
  } catch (err) {
    console.error("Error building JS bundle:", err);
    process.exit(1);
  }

  console.log("\n=== Building CSS Bundle ===");
  try {
    let cssContent = "";
    for (const file of CSS_FILES) {
      const filePath = path.join(assetsDir, file);
      console.log(`Reading CSS: ${file}`);
      cssContent += fs.readFileSync(filePath, 'utf8') + "\n";
    }

    console.log("Minifying CSS...");
    const minifiedCss = cssContent
      .replace(/\/\*[\s\S]*?\*\//g, '')   // Remove comments
      .replace(/\s+/g, ' ')               // Collapse multiple spaces/newlines
      .replace(/\s*([\{\}:;,])\s*/g, '$1') // Remove spaces around delimiters
      .replace(/;\}/g, '}')               // Remove trailing semicolons in blocks
      .trim();

    fs.writeFileSync(targetCssBundle, minifiedCss, 'utf8');
    console.log(`✓ CSS Bundle built successfully: ${targetCssBundle} (${minifiedCss.length} bytes)`);
  } catch (err) {
    console.error("Error building CSS bundle:", err);
    process.exit(1);
  }

  console.log("\n=== Synchronizing Assets ===");
  try {
    const scaGithubAssetsDir = path.resolve(__dirname, 'sca_github/assets');
    if (fs.existsSync(scaGithubAssetsDir)) {
      // Sync sca-kinetic.js
      const srcKinetic = path.join(assetsDir, 'sca-kinetic.js');
      const dstKinetic = path.join(scaGithubAssetsDir, 'sca-kinetic.js');
      fs.copyFileSync(srcKinetic, dstKinetic);
      console.log(`✓ Synced sca-kinetic.js to ${dstKinetic}`);

      // Sync sca.css
      const srcCss = path.join(assetsDir, 'sca.css');
      const dstCss = path.join(scaGithubAssetsDir, 'sca.css');
      fs.copyFileSync(srcCss, dstCss);
      console.log(`✓ Synced sca.css to ${dstCss}`);
    }
  } catch (err) {
    console.warn("Warning: Could not sync assets to sca_github folder:", err.message);
  }

  console.log("\n=== Build Complete ===");
}

build();
