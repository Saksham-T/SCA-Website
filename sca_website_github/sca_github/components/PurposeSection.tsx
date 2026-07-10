import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';

/* ============================================================
   SCA — SCENE 3: PURPOSE (MISSION -> VISION)
   A pinned, cinematic scroll narrative. Present (Mission) reveals
   first; Vision grows out of it as background light travels and a
   diagonal "seam" completes. Not two cards. Not a divider layout.
   ============================================================ */

const ACCENT_LIGHT_BLUE = '#6688ff';
const ACCENT_BLUE = '#2E54E8';

const MISSION = {
  index: '01',
  label: 'Why We Exist',
  lines: ['To build distribution', 'for brands that', 'refuse to be ignored.'],
};

const VISION = {
  index: '02',
  label: 'Where We Are Going',
  lines: ["Building the infrastructure", "for India's next generation", 'of D2C and tech giants.'],
};

/* Premium fractal-noise grain, inlined as a data URI so nothing extra loads. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* --- A single statement line that rises + fades within a scroll window --- */
function RevealLine({
  progress,
  start,
  end,
  children,
  className,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: React.ReactNode;
  className?: string;
}) {
  const y = useTransform(progress, [start, end], ['0.4em', '0em']);
  const opacity = useTransform(progress, [start, Math.min(end, start + (end - start) * 0.85)], [0, 1]);
  return (
    <span className="block pb-[0.12em]">
      <motion.span
        style={{ y, opacity, willChange: 'transform, opacity' }}
        className={`block ${className ?? ''}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* --- Static, accessible fallback (reduced motion) --- */
function StaticPurpose() {
  return (
    <section
      id="purpose"
      aria-labelledby="purpose-heading"
      className="relative w-full overflow-hidden bg-[#08080A] py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 55% at 30% 40%, ${ACCENT_BLUE}1c, transparent 70%), radial-gradient(50% 50% at 75% 65%, ${ACCENT_LIGHT_BLUE}12, transparent 70%)`
        }}
      />
      <h2 id="purpose-heading" className="sr-only">
        Our mission and vision
      </h2>
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="max-w-[38ch]">
          <p className="font-serif text-[clamp(1.9rem,4.4vw,3.75rem)] font-light leading-[1.1] tracking-tight text-white">
            {MISSION.lines.join(' ')}
          </p>
        </div>
        <div className="my-16 h-px w-40 origin-left bg-gradient-to-r from-[#2E54E8] via-[#6688ff] to-transparent" />
        <div className="ml-auto max-w-[38ch] text-right">
          <p className="font-serif text-[clamp(1.9rem,4.4vw,3.75rem)] font-light leading-[1.1] tracking-tight text-white">
            {VISION.lines.join(' ')}
          </p>
        </div>
      </div>
    </section>
  );
}

/* --- Ambient background: mesh light that travels, grain, grid, particles --- */
function Atmosphere({ progress }: { progress: MotionValue<number> }) {
  // Present light sits left; future light drifts right as we scroll.
  const glowX = useTransform(progress, [0, 1], [26, 74]);
  const glowY = useTransform(progress, [0, 0.5, 1], [56, 46, 34]);
  const secondGlow = useTransform(progress, [0, 1], [80, 30]);
  const meshBg = useMotionTemplate`radial-gradient(48% 50% at ${glowX}% ${glowY}%, rgba(46, 84, 234, 0.20), transparent 68%), radial-gradient(40% 46% at ${secondGlow}% 78%, rgba(102, 136, 255, 0.08), transparent 70%)`;
  const gridOpacity = useTransform(progress, [0, 0.35, 1], [0.02, 0.06, 0.03]);

  const particles = [
    { l: '14%', t: '24%', s: 3, d: 0 },
    { l: '78%', t: '18%', s: 2, d: 1.4 },
    { l: '64%', t: '66%', s: 4, d: 0.7 },
    { l: '30%', t: '72%', s: 2, d: 2.1 },
    { l: '88%', t: '48%', s: 3, d: 1.1 },
    { l: '46%', t: '12%', s: 2, d: 2.8 },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-[#08080A]" />
      {/* travelling mesh light */}
      <motion.div className="absolute inset-0" style={{ background: meshBg }} />
      {/* architectural grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(70% 70% at 50% 45%, black, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 45%, black, transparent 100%)',
        }}
      />
      {/* floating accent particles */}
      {particles.map((p, i) => {
        const particleColor = i % 2 === 0 ? ACCENT_BLUE : ACCENT_LIGHT_BLUE;
        return (
          <span
            key={i}
            className="sca-particle absolute rounded-full"
            style={{
              left: p.l,
              top: p.t,
              width: p.s,
              height: p.s,
              background: particleColor,
              opacity: 0.5,
              boxShadow: `0 0 ${p.s * 4}px ${particleColor}`,
              animationDelay: `${p.d}s`,
            }}
          />
        );
      })}
      {/* premium grain */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{ backgroundImage: GRAIN, backgroundSize: '240px 240px', opacity: 0.09 }}
      />
      {/* vignette to seat the type */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)' }}
      />
    </div>
  );
}

export function PurposeSection() {
  const reduce = useReducedMotion();
  // Branch into separate components so hooks stay unconditional in each
  // (prefers-reduced-motion can change at runtime).
  return reduce ? <StaticPurpose /> : <AnimatedPurpose />;
}

function AnimatedPurpose() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const p = scrollYProgress;

  /* ---- Ghost words: TODAY -> TOMORROW parallax cross-fade ---- */
  const ghostX = useTransform(p, [0, 0.58, 0.72, 1], ['8%', '20%', '-4%', '-4%']);
  const todayOpacity = useTransform(p, [0.02, 0.14, 0.48, 0.60], [0, 0.055, 0.055, 0]);
  const tomorrowOpacity = useTransform(p, [0.62, 0.76, 1], [0, 0.05, 0.045]);

  /* ---- Mission: reveals first, then fully clears before Vision ---- */
  const missionLabelOpacity = useTransform(p, [0.02, 0.1], [0, 1]);
  const missionScale = useTransform(p, [0.50, 0.54], [1, 0.9]);
  const missionRecede = useTransform(p, [0.48, 0.54, 1], [1, 0, 0]);
  const missionX = useTransform(p, [0.50, 0.54], ['0%', '-4%']);

  /* ---- Seam: diagonal light that grows organically (the connector) ---- */
  const seamScaleY = useTransform(p, [0.42, 0.58], [0, 1]);
  const seamOpacity = useTransform(p, [0.40, 0.48, 1], [0, 1, 0.85]);
  const sparkTop = useTransform(p, [0.44, 0.66], ['0%', '100%']);
  const sparkOpacity = useTransform(p, [0.42, 0.48, 0.64, 0.72], [0, 1, 1, 0]);

  /* ---- Vision: emerges from depth, brightens fully with room to read ---- */
  const visionLabelOpacity = useTransform(p, [0.62, 0.70], [0, 1]);
  const visionOpacity = useTransform(p, [0.62, 0.76], [0, 1]);
  const visionX = useTransform(p, [0.62, 0.80], ['8%', '0%']);
  const visionBlur = useTransform(p, [0.62, 0.76], [10, 0]);
  const visionFilter = useMotionTemplate`blur(${visionBlur}px)`;

  /* ---- Mobile sequential transforms ---- */
  const mMissionOpacity = useTransform(p, [0, 0.06, 0.46, 0.56], [0, 1, 1, 0]);
  const mMissionY = useTransform(p, [0.40, 0.58], ['0%', '-14%']);
  const mSeamScaleX = useTransform(p, [0.46, 0.60], [0, 1]);
  const mVisionOpacity = useTransform(p, [0.62, 0.74], [0, 1]);
  const mVisionY = useTransform(p, [0.62, 0.86], ['14%', '0%']);

  return (
    <section
      id="purpose"
      ref={sectionRef}
      aria-labelledby="purpose-heading"
      className="relative w-full h-[260vh] md:h-[320vh] bg-[#08080A]"
    >
      {/* keyframes for the ambient particles (scoped, self-contained) */}
      <style>{`
        @keyframes sca-float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-14px) translateX(6px); }
        }
        .sca-particle { animation: sca-float 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .sca-particle { animation: none; } }
      `}</style>

      {/* PINNED STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Atmosphere progress={p} />

        <h2 id="purpose-heading" className="sr-only">
          Our mission and vision &mdash; from why we exist today to where we are going
        </h2>

        {/* Ghost typography layer */}
        <motion.div
          aria-hidden="true"
          style={{ x: ghostX }}
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <motion.span
            style={{ opacity: todayOpacity }}
            className="absolute select-none font-sans text-[26vw] font-bold uppercase leading-none tracking-tighter text-white"
          >
            Today
          </motion.span>
          <motion.span
            style={{ opacity: tomorrowOpacity }}
            className="absolute select-none font-sans text-[20vw] font-bold uppercase leading-none tracking-tighter text-white"
          >
            Tomorrow
          </motion.span>
        </motion.div>

        {/* ============ DESKTOP / TABLET COMPOSITION (asymmetric, diagonal) ============ */}
        <div className="relative z-10 mx-auto hidden h-full max-w-[1440px] px-[6vw] md:block">
          {/* Growing diagonal seam — connects present (lower-left) to future (upper-right) */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: seamOpacity }}
            className="absolute left-[50%] top-[10%] h-[80%] w-px"
          >
            <div className="relative h-full w-full rotate-[9deg]">
              <motion.div
                style={{ scaleY: seamScaleY, willChange: 'transform' }}
                className="absolute inset-0 origin-top"
              >
                <div
                  className="h-full w-px"
                  style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT_BLUE}, ${ACCENT_LIGHT_BLUE}, transparent)` }}
                />
              </motion.div>
              {/* travelling spark */}
              <motion.div
                style={{ top: sparkTop, opacity: sparkOpacity }}
                className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
              >
                <div
                  className="h-full w-full rounded-full"
                  style={{ background: '#fff', boxShadow: `0 0 16px 4px ${ACCENT_BLUE}` }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* MISSION — lower-left, reveals first, then recedes */}
          <motion.div
            style={{ scale: missionScale, opacity: missionRecede, x: missionX, willChange: 'transform, opacity' }}
            className="absolute left-[6vw] top-[54%] max-w-[34ch] origin-left -translate-y-1/2 text-left"
          >
            <p className="font-serif text-[clamp(2rem,4.2vw,4.25rem)] font-light leading-[1.16] tracking-tight text-white">
              {MISSION.lines.map((line, i) => (
                <RevealLine key={i} progress={p} start={0.08 + i * 0.05} end={0.28 + i * 0.05}>
                  {line}
                </RevealLine>
              ))}
            </p>
          </motion.div>

          {/* VISION — upper-right, emerges from depth, mask-wipes into balance */}
          <motion.div
            style={{ opacity: visionOpacity, x: visionX, filter: visionFilter, willChange: 'transform, opacity, filter' }}
            className="absolute right-[6vw] top-[42%] ml-auto max-w-[clamp(20ch,35vw,34ch)] -translate-y-1/2 text-right"
          >
            <p className="font-serif text-[clamp(2rem,4.2vw,4.25rem)] font-light leading-[1.16] tracking-tight text-white">
              {VISION.lines.map((line, i) => (
                <RevealLine key={i} progress={p} start={0.56 + i * 0.05} end={0.70 + i * 0.05}>
                  {line}
                </RevealLine>
              ))}
            </p>
          </motion.div>
        </div>

        {/* ============ MOBILE COMPOSITION (sequential narrative) ============ */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-7 text-center md:hidden">
          {/* Mission fills the screen first */}
          <motion.div
            style={{ opacity: mMissionOpacity, y: mMissionY }}
            className="absolute w-full max-w-[26ch] px-7"
          >
            <p className="font-serif text-[clamp(1.9rem,8.5vw,2.75rem)] font-light leading-[1.12] tracking-tight text-white">
              {MISSION.lines.join(' ')}
            </p>
          </motion.div>

          {/* Growing seam transition */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: mSeamScaleX }}
            className="absolute h-px w-40 origin-center"
          >
            <div
              className="h-full w-full"
              style={{ background: `linear-gradient(to right, transparent, ${ACCENT_BLUE}, ${ACCENT_LIGHT_BLUE}, transparent)` }}
            />
          </motion.div>

          {/* Vision arrives */}
          <motion.div
            style={{ opacity: mVisionOpacity, y: mVisionY }}
            className="absolute w-full max-w-[26ch] px-7"
          >
            <p className="font-serif text-[clamp(1.9rem,8.5vw,2.75rem)] font-light leading-[1.12] tracking-tight text-white">
              {VISION.lines.join(' ')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
