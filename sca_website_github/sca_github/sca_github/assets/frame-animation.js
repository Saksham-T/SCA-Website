/**
 * SCA Careers Hero — Frame-by-Frame Canvas Animation
 * Loops through frames/frame_001.jpg … frames/frame_019.jpg on a <canvas>
 * at 24 fps. On hover the animation slows to a crawl for a cinematic feel.
 * After all frames load a progress indicator hides and playback begins.
 */
(function () {
  'use strict';

  const TOTAL_FRAMES = 19;
  const FPS_NORMAL   = 24;      // playback speed
  const FPS_HOVER    = 8;       // slowed on hover
  const FRAME_BASE   = 'assets/frames/frame_';  // relative to HTML file

  /**
   * Zero-pad a number to 3 digits.
   */
  function pad3(n) {
    return String(n).padStart(3, '0');
  }

  /**
   * Load all frame images as HTMLImageElement objects.
   * Returns a Promise that resolves with an array of images.
   */
  function loadFrames(basePath, total, onProgress) {
    const images = [];
    let loaded = 0;

    return new Promise((resolve) => {
      for (let i = 1; i <= total; i++) {
        const img = new Image();
        img.src = basePath + pad3(i) + '.jpg';
        img.onload = img.onerror = () => {
          loaded++;
          if (typeof onProgress === 'function') onProgress(loaded, total);
          if (loaded === total) resolve(images);
        };
        images.push(img);
      }
    });
  }

  /**
   * Main initialisation — call once the DOM is ready.
   */
  function initFrameAnimation() {
    const canvas = document.getElementById('careers-hero-canvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    const card   = canvas.closest('.hero-frame-card');

    // --- Progress overlay (shown while frames are loading) ---
    const loadOverlay = document.createElement('div');
    loadOverlay.id = 'hero-frame-loader';
    loadOverlay.innerHTML = `
      <div class="hfl-inner">
        <span class="hfl-label">Loading animation…</span>
        <div class="hfl-bar-wrap"><div class="hfl-bar" id="hfl-bar"></div></div>
      </div>`;
    if (card) card.style.position = 'relative';
    canvas.parentElement.appendChild(loadOverlay);

    const hflBar = document.getElementById('hfl-bar');

    // --- Resize canvas to match display size (HiDPI) ---
    function resizeCanvas() {
      const dpr  = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
      resizeCanvas();
      // Force a redraw immediately after resize
      if (frames.length > 0) drawFrame(currentFrame);
    }, { passive: true });

    // --- Frame state ---
    const frames = [];
    let currentFrame  = 0;
    let lastTimestamp = 0;
    let hovering      = false;
    let animHandle    = null;

    // --- Draw a single frame index to canvas ---
    function drawFrame(idx) {
      const img  = frames[idx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width  / (window.devicePixelRatio || 1);
      const ch = canvas.height / (window.devicePixelRatio || 1);

      // Cover-fit: fill the canvas while maintaining image aspect ratio
      const imgAR    = img.naturalWidth / img.naturalHeight;
      const canvasAR = cw / ch;
      let sw, sh, sx, sy;
      if (imgAR > canvasAR) {
        sh = ch;
        sw = ch * imgAR;
        sy = 0;
        sx = (cw - sw) / 2;
      } else {
        sw = cw;
        sh = cw / imgAR;
        sx = 0;
        sy = (ch - sh) / 2;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    }

    // --- Animation loop ---
    function loop(timestamp) {
      const fps      = hovering ? FPS_HOVER : FPS_NORMAL;
      const interval = 1000 / fps;

      if (timestamp - lastTimestamp >= interval) {
        drawFrame(currentFrame);
        currentFrame = (currentFrame + 1) % frames.length;
        lastTimestamp = timestamp;
      }

      animHandle = requestAnimationFrame(loop);
    }

    // --- Hover interaction ---
    function setupHoverEffects() {
      const container = canvas.closest('.hero-frame-card') || canvas.parentElement;
      container.addEventListener('mouseenter', () => { hovering = true; });
      container.addEventListener('mouseleave', () => { hovering = false; });
    }

    // --- Load frames then start ---
    loadFrames(FRAME_BASE, TOTAL_FRAMES, (loaded, total) => {
      const pct = (loaded / total) * 100;
      if (hflBar) hflBar.style.width = pct + '%';
    }).then((imgs) => {
      frames.push(...imgs);

      // Fade out and remove loader overlay
      loadOverlay.style.transition = 'opacity 0.45s ease';
      loadOverlay.style.opacity    = '0';
      setTimeout(() => loadOverlay.remove(), 500);

      // Show canvas
      canvas.style.opacity = '1';

      setupHoverEffects();
      animHandle = requestAnimationFrame(loop);
    });
  }

  // --- Boot when DOM is ready ---
  if (document.readyState !== 'loading') {
    initFrameAnimation();
  } else {
    document.addEventListener('DOMContentLoaded', initFrameAnimation);
  }
})();
