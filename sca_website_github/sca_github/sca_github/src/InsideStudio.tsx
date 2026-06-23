import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudioCanvas from './components/StudioCanvas';
import NodeModal from './components/NodeModal';
import TerminalOverlay from './components/TerminalOverlay';
import { Volume2, VolumeX, Terminal, ShieldAlert } from 'lucide-react';

// Quotes database
const STUDIO_QUOTES = [
  { text: "Speed is our ultimate unfair advantage. We ship weekly, not quarterly.", author: "Sarthak, Founder", node: "Velocity" },
  { text: "If it's not live, it doesn't exist. There is no hideout in deck building.", author: "Saksham, Developer", node: "Velocity" },
  { text: "No middle managers. You own the code, the client, and the results.", author: "Melbin, Strategist", node: "Ownership" },
  { text: "The studio's products are ours. We write assets that compound value.", author: "Ananya, Tech Lead", node: "Ownership" },
  { text: "Every pixel must fight for its life. Polish is not an afterthought.", author: "Parag, Lead Designer", node: "Craft" },
  { text: "D2C brands need motion, not slides. We craft distribution channels.", author: "Pune Production Team", node: "Craft" },
  { text: "A focused room of 14 people beats a bloated agency of 100 anytime.", author: "HQ Strategy Team", node: "The Room" },
  { text: "We are deliberate about who enters the room. Craft aligns here.", author: "Core Council", node: "The Room" }
];

export type NodeKey = 'velocity' | 'ownership' | 'craft' | 'room' | 'future';

export interface NodeData {
  id: NodeKey;
  num: string;
  name: string;
  tagline: string;
  culture: string;
  oneLiner: string;
  bgGlow: string;
}

const NODES_DATA: Record<NodeKey, NodeData> = {
  velocity: {
    id: 'velocity',
    num: '01',
    name: 'Velocity',
    tagline: 'Ship, don\'t deck.',
    culture: 'Fast iterations, zero administrative layers, constant builds going live.',
    oneLiner: 'We strategise, build, and ship. No endless decks — every person here watches their work go live, weekly.',
    bgGlow: 'rgba(46, 84, 234, 0.4)'
  },
  ownership: {
    id: 'ownership',
    num: '02',
    name: 'Ownership',
    tagline: 'Your work compounds.',
    culture: 'Direct control over features, equity in internal products, real responsibility.',
    oneLiner: 'We\'re building three in-house products. The studio\'s growth is yours too — you build assets, not just deliverables.',
    bgGlow: 'rgba(168, 85, 247, 0.4)'
  },
  craft: {
    id: 'craft',
    num: '03',
    name: 'Craft',
    tagline: 'Real brands, real budgets.',
    culture: 'Obsessive details, high-end motion guidelines, high fidelity aesthetics.',
    oneLiner: 'Ambitious D2C clients, big-budget productions, and India-scale distribution campaigns. Work that\'s actually seen.',
    bgGlow: 'rgba(236, 72, 153, 0.4)'
  },
  room: {
    id: 'room',
    num: '04',
    name: 'The Room',
    tagline: 'Pune HQ. No layers.',
    culture: 'Cohesive collaboration, intense alignment, zero bureaucratic politics.',
    oneLiner: 'A focused studio with a tight team. We\'re deliberate about who joins the room — and what they get to own.',
    bgGlow: 'rgba(57, 255, 20, 0.3)'
  },
  future: {
    id: 'future',
    num: '05',
    name: 'Future',
    tagline: 'Upcoming Products & Vision',
    culture: 'Next-gen distribution networks, in-house SaaS launchpads, studio scaling.',
    oneLiner: 'Unlocked Node: Unlock incoming products, upcoming studio expansions, and long-term brand equity plans.',
    bgGlow: 'rgba(252, 114, 51, 0.4)'
  }
};

// Synth Audio Helper
export const playSound = (type: 'tick' | 'click' | 'powerup', enabled: boolean) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'powerup') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.warn("Audio Context failed to initialize", e);
  }
};

export default function InsideStudio() {
  const [activeNode, setActiveNode] = useState<NodeKey | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeKey | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [openedHistory, setOpenedHistory] = useState<Set<NodeKey>>(new Set());
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [founderMode, setFounderMode] = useState(false);
  
  // Parallax tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Voices / Quotes cycle
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Keyboard hooks for easter eggs
  const keyBufferRef = useRef<string[]>([]);
  const konamiRef = useRef<string[]>([]);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

  // continuous counter updates
  const [telemetry, setTelemetry] = useState({
    projects: 342,
    videos: 1259,
    campaigns: 84,
    products: 3
  });

  useEffect(() => {
    // Quote cycle
    const quoteInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % STUDIO_QUOTES.length);
    }, 6000);

    // Telemetry updates
    const teleInterval = setInterval(() => {
      setTelemetry(prev => ({
        projects: prev.projects + (Math.random() > 0.7 ? 1 : 0),
        videos: prev.videos + Math.floor(Math.random() * 2),
        campaigns: prev.campaigns + (Math.random() > 0.95 ? 1 : 0),
        products: prev.products // stays stable
      }));
    }, 3000);

    // Key handlers for terminal and Konami
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Terminal code ('seetusk')
      keyBufferRef.current.push(e.key.toLowerCase());
      if (keyBufferRef.current.length > 20) keyBufferRef.current.shift();
      const word = keyBufferRef.current.join('');
      if (word.includes('seetusk')) {
        setTerminalOpen(true);
        playSound('powerup', soundEnabled);
        keyBufferRef.current = [];
      }

      // 2. Konami code
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > konamiCode.length) konamiRef.current.shift();
      if (konamiRef.current.join(',') === konamiCode.join(',')) {
        setFounderMode(prev => {
          const next = !prev;
          playSound('powerup', soundEnabled);
          return next;
        });
        konamiRef.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Mouse Move tracking for Parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(teleInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [soundEnabled]);

  // Track Node Opens to unlock Future Node (05)
  const handleNodeClick = (nodeKey: NodeKey) => {
    setActiveNode(nodeKey);
    playSound('click', soundEnabled);
    
    if (nodeKey !== 'future') {
      const nextHistory = new Set(openedHistory);
      nextHistory.add(nodeKey);
      setOpenedHistory(nextHistory);
      
      // If 4 main nodes opened, play synth victory tune
      if (nextHistory.size === 4 && !openedHistory.has(nodeKey)) {
        setTimeout(() => {
          playSound('powerup', soundEnabled);
        }, 300);
      }
    }
  };

  const isFutureUnlocked = openedHistory.has('velocity') &&
                            openedHistory.has('ownership') &&
                            openedHistory.has('craft') &&
                            openedHistory.has('room');

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[105vh] bg-studio-bg overflow-hidden flex flex-col justify-between font-body text-white transition-colors duration-1000 ${
        founderMode ? 'border-t-4 border-studio-amber' : 'border-t border-studio-border'
      }`}
      style={{
        background: founderMode
          ? 'radial-gradient(circle at center, #1b160b 0%, #050505 100%)'
          : 'radial-gradient(circle at center, #0a0e28 0%, #050816 100%)'
      }}
    >
      {/* Film grain layer */}
      <div className="absolute inset-0 pointer-events-none z-10 film-grain" />

      {/* Grid line overlay background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)]" />

      {/* Blurred Back Wordmark */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * -35}px), calc(-50% + ${mousePos.y * -35}px))`
        }}
      >
        <span 
          className={`text-[clamp(100px,18vw,350px)] font-black uppercase tracking-widest opacity-[0.015] blur-md transition-colors duration-1000 ${
            founderMode ? 'text-studio-amber' : 'text-white'
          }`}
        >
          THE STUDIO
        </span>
      </div>

      {/* HEADER BAR */}
      <div className="relative w-full px-6 md:px-12 py-8 z-20 flex justify-between items-center bg-gradient-to-b from-[#050816] to-transparent">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-studio-blue font-mono font-semibold">
            <span className={`w-2 h-2 rounded-full animate-pulse-slow ${founderMode ? 'bg-studio-amber' : 'bg-studio-blue'}`} />
            03 / CULTURE
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase mt-1 tracking-tight">
            INSIDE THE <span className={`transition-colors duration-1000 ${founderMode ? 'text-studio-amber' : 'text-studio-blue'}`}>STUDIO</span>
          </h2>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-4">
          {founderMode && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-studio-amber/10 border border-studio-amber/20 text-studio-amber rounded-full text-xs font-mono font-bold animate-pulse-slow">
              <ShieldAlert size={14} />
              FOUNDER MODE ACTIVE
            </div>
          )}

          <button
            onClick={() => setTerminalOpen(true)}
            className="p-2.5 rounded-lg bg-studio-panel border border-studio-border hover:border-studio-blue transition-colors duration-300 text-gray-400 hover:text-white"
            title="Type 'seetusk' or click to open console"
          >
            <Terminal size={18} />
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound('click', !soundEnabled);
            }}
            className="p-2.5 rounded-lg bg-studio-panel border border-studio-border hover:border-studio-blue transition-colors duration-300 text-gray-400 hover:text-white"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* 3D SCENE + CANVASES */}
      <div className="absolute inset-0 z-0">
        <StudioCanvas
          hoveredNode={hoveredNode}
          setHoveredNode={(node) => {
            setHoveredNode(node);
            if (node) playSound('tick', soundEnabled);
          }}
          activeNode={activeNode}
          onNodeClick={handleNodeClick}
          mousePos={mousePos}
          isFutureUnlocked={isFutureUnlocked}
          founderMode={founderMode}
        />
      </div>

      {/* CENTRAL CULTURE CARD (Appears on Hover) */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-20 pointer-events-none text-center px-4">
        <AnimatePresence mode="wait">
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-panel p-6 rounded-2xl border border-studio-border"
            >
              <div className="flex justify-center items-center gap-2 mb-1">
                <span className="font-mono text-xs text-studio-violet">{NODES_DATA[hoveredNode].num}</span>
                <span className="uppercase text-sm tracking-wider font-extrabold">{NODES_DATA[hoveredNode].name}</span>
              </div>
              <h4 className="text-xl font-display font-extrabold text-white mb-2">{NODES_DATA[hoveredNode].tagline}</h4>
              <p className="text-xs text-gray-400">{NODES_DATA[hoveredNode].oneLiner}</p>
              <div className="mt-3 pt-3 border-t border-studio-border text-[11px] text-studio-blue font-mono font-semibold">
                CULTURE: {NODES_DATA[hoveredNode].culture}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* VOICES & COUNTERS TELEMETRY FOOTER */}
      <div className="relative w-full z-20 bg-gradient-to-t from-[#050816] via-[#050816]/90 to-transparent px-6 md:px-12 py-10 flex flex-col lg:flex-row justify-between items-center gap-8 border-t border-studio-border/20">
        
        {/* VOICES FROM THE STUDIO */}
        <div className="flex items-center gap-4 w-full lg:max-w-xl">
          <div className="hidden sm:flex flex-col items-center">
            <span className="w-1.5 h-1.5 bg-studio-violet rounded-full mb-1 animate-ping" />
            <span className="text-[10px] text-studio-violet font-mono uppercase tracking-widest font-bold [writing-mode:vertical-lr]">VOICES</span>
          </div>
          <div className="min-h-[50px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-sm italic text-gray-300 font-medium">"{STUDIO_QUOTES[quoteIdx].text}"</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-studio-violet">{STUDIO_QUOTES[quoteIdx].author}</span>
                  <span className="text-[10px] font-mono text-gray-600">[{STUDIO_QUOTES[quoteIdx].node}]</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* TELEMETRY TELEGRAPH COUNTERS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-12 w-full lg:w-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase">PROJECTS SHIPPED</span>
            <strong className="text-xl md:text-2xl font-display font-extrabold tracking-tight mt-0.5 text-white">
              {telemetry.projects}
            </strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase">VIDEOS PRODUCED</span>
            <strong className="text-xl md:text-2xl font-display font-extrabold tracking-tight mt-0.5 text-white">
              {telemetry.videos}
            </strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase">CAMPAIGNS OPENED</span>
            <strong className="text-xl md:text-2xl font-display font-extrabold tracking-tight mt-0.5 text-white">
              {telemetry.campaigns}
            </strong>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase">PRODUCTS BUILT</span>
            <strong className="text-xl md:text-2xl font-display font-extrabold tracking-tight mt-0.5 text-white">
              {telemetry.products} <small className="text-xs text-studio-blue font-bold">LIVE</small>
            </strong>
          </div>
        </div>
      </div>

      {/* FULL PANEL TRANSITIONS */}
      <AnimatePresence>
        {activeNode && (
          <NodeModal
            nodeKey={activeNode}
            node={NODES_DATA[activeNode]}
            onClose={() => {
              setActiveNode(null);
              playSound('click', soundEnabled);
            }}
            soundEnabled={soundEnabled}
            founderMode={founderMode}
          />
        )}
      </AnimatePresence>

      {/* TERMINAL MODAL */}
      <AnimatePresence>
        {terminalOpen && (
          <TerminalOverlay
            onClose={() => {
              setTerminalOpen(false);
              playSound('click', soundEnabled);
            }}
            soundEnabled={soundEnabled}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
