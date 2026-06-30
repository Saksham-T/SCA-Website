/* ============================================================
   SCA — Magnetic button (spring)
   A faithful vanilla port of the framer-motion "MagneticButton":
   the target follows the cursor while hovered and springs back to
   rest on leave. Motion is driven by a real spring integrator
   (stiffness 150 / damping 15 / mass 0.1 — framer-motion defaults)
   running on a wrapper element, so the button keeps its own hover
   and :active transitions untouched.

   Usage: add data-magnetic-spring="0.4" to any button/link.
   The number is the pull strength (fraction of cursor offset).
   Honors prefers-reduced-motion and skips touch / no-hover devices.
   ============================================================ */
(function () {
  var mq = window.matchMedia;
  var reduce = mq && mq('(prefers-reduced-motion: reduce)').matches;
  var noHover = mq && mq('(hover: none)').matches;

  // framer-motion spring defaults from the reference component
  var STIFFNESS = 150;
  var DAMPING = 15;
  var MASS = 0.1;
  var SUBSTEPS = 6;            // integration sub-steps per frame (stability)
  var DT = (1 / 60) / SUBSTEPS;
  var REST = 0.01;             // settle threshold (px / px·s)

  function attach(el, strength) {
    if (el.__magnetic) return;
    el.__magnetic = true;

    // Wrap the element so transforms never fight its own transitions.
    var wrap = document.createElement('span');
    wrap.className = 'magnetic-wrap';
    wrap.style.display = 'inline-flex';
    wrap.style.willChange = 'transform';
    wrap.style.backfaceVisibility = 'hidden';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);

    var x = 0, y = 0, vx = 0, vy = 0;   // current state
    var tx = 0, ty = 0;                 // target
    var raf = null;

    function step() {
      for (var i = 0; i < SUBSTEPS; i++) {
        var ax = (-STIFFNESS * (x - tx) - DAMPING * vx) / MASS;
        var ay = (-STIFFNESS * (y - ty) - DAMPING * vy) / MASS;
        vx += ax * DT; vy += ay * DT;
        x += vx * DT;  y += vy * DT;
      }
      wrap.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)';

      var settled =
        Math.abs(x - tx) < REST && Math.abs(vx) < REST &&
        Math.abs(y - ty) < REST && Math.abs(vy) < REST;
      if (settled) {
        x = tx; y = ty; vx = vy = 0;
        wrap.style.transform = (tx === 0 && ty === 0)
          ? '' : 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px)';
        raf = null;
        return;
      }
      raf = requestAnimationFrame(step);
    }
    function run() { if (!raf) raf = requestAnimationFrame(step); }

    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
      run();
    });
    el.addEventListener('mouseleave', function () {
      tx = 0; ty = 0; run();
    });
  }

  function init() {
    if (reduce || noHover) return;
    var nodes = document.querySelectorAll('[data-magnetic-spring]');
    for (var i = 0; i < nodes.length; i++) {
      var s = parseFloat(nodes[i].getAttribute('data-magnetic-spring'));
      if (isNaN(s)) s = 0.4;
      attach(nodes[i], s);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
