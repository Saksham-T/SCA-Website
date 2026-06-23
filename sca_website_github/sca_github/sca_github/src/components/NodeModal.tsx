import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Clock, Milestone, Target, Rocket, Award, Monitor, Heart, Users, MapPin, Zap } from 'lucide-react';
import { NodeData, playSound } from '../InsideStudio';

interface NodeModalProps {
  nodeKey: string;
  node: NodeData;
  onClose: () => void;
  soundEnabled: boolean;
  founderMode: boolean;
}

export default function NodeModal({ nodeKey, node, onClose, soundEnabled, founderMode }: NodeModalProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'stats'>('content');

  // Modal ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Color scheme helpers
  const getColorClasses = () => {
    if (founderMode) return {
      text: 'text-studio-amber',
      bg: 'bg-studio-amber',
      border: 'border-studio-amber/30',
      glow: 'shadow-studio-amber/20',
      bgLight: 'bg-studio-amber/10'
    };
    switch (nodeKey) {
      case 'velocity':
        return {
          text: 'text-studio-blue',
          bg: 'bg-studio-blue',
          border: 'border-studio-blue/30',
          glow: 'shadow-studio-blue/20',
          bgLight: 'bg-studio-blue/10'
        };
      case 'ownership':
        return {
          text: 'text-studio-violet',
          bg: 'bg-studio-violet',
          border: 'border-studio-violet/30',
          glow: 'shadow-studio-violet/20',
          bgLight: 'bg-studio-violet/10'
        };
      case 'craft':
        return {
          text: 'text-pink-500',
          bg: 'bg-pink-500',
          border: 'border-pink-500/30',
          glow: 'shadow-pink-500/20',
          bgLight: 'bg-pink-500/10'
        };
      case 'room':
        return {
          text: 'text-studio-signal',
          bg: 'bg-studio-signal',
          border: 'border-studio-signal/30',
          glow: 'shadow-studio-signal/20',
          bgLight: 'bg-studio-signal/10'
        };
      case 'future':
        return {
          text: 'text-orange-500',
          bg: 'bg-orange-500',
          border: 'border-orange-500/30',
          glow: 'shadow-orange-500/20',
          bgLight: 'bg-orange-500/10'
        };
      default:
        return {
          text: 'text-studio-blue',
          bg: 'bg-studio-blue',
          border: 'border-studio-blue/30',
          glow: 'shadow-studio-blue/20',
          bgLight: 'bg-studio-blue/10'
        };
    }
  };

  const colors = getColorClasses();

  // Custom panel contents
  const renderPanelContent = () => {
    switch (nodeKey) {
      case 'velocity':
        return (
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-xl border border-studio-border">
              <h4 className="text-sm font-mono text-gray-400 mb-4 flex items-center gap-2">
                <Clock size={16} className={colors.text} />
                WEEKLY SHIPPING PIPELINE
              </h4>
              <div className="relative border-l-2 border-studio-border pl-6 ml-3 space-y-6">
                <div className="relative">
                  <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-studio-bg ${colors.bg}`} />
                  <strong className="text-sm uppercase font-mono block">MON // CONCEPT ALIGNMENT</strong>
                  <span className="text-xs text-gray-400">Brief evaluation, moodboards locking, and developer-creator sync. Zero decks.</span>
                </div>
                <div className="relative">
                  <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-studio-bg ${colors.bg}`} />
                  <strong className="text-sm uppercase font-mono block">WED // FIRST BUILD</strong>
                  <span className="text-xs text-gray-400">High-fidelity prototypes, initial edits, draft assets live. Staggered reviews.</span>
                </div>
                <div className="relative">
                  <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-studio-bg ${colors.bg}`} />
                  <strong className="text-sm uppercase font-mono block">FRI // SHIP TO PRODUCTION</strong>
                  <span className="text-xs text-gray-400">Final bundle deployment, campaign assets live-broadcasted. Distribution begins.</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-studio-border">
              <h4 className="text-sm font-mono text-gray-400 mb-3 flex items-center gap-2">
                <Zap size={16} className={colors.text} />
                LIVE STUDIO TELEMETRY FEED
              </h4>
              <div className="space-y-2.5 font-mono text-xs text-studio-signal">
                <div className="flex justify-between border-b border-studio-border/25 pb-1">
                  <span>[2026-06-23 16:15] PIPELINE_TRANSMIT: OK</span>
                  <span className="text-gray-500">2m ago</span>
                </div>
                <div className="flex justify-between border-b border-studio-border/25 pb-1">
                  <span>[2026-06-23 15:02] COMPILATION_SUCCESS: assets/sca.bundle.min.js</span>
                  <span className="text-gray-500">1h ago</span>
                </div>
                <div className="flex justify-between">
                  <span>[2026-06-23 12:40] SHIPMENT_LAUNCHED: customer campaign "pulsar-night"</span>
                  <span className="text-gray-500">3h ago</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ownership':
        return (
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-xl border border-studio-border">
              <h4 className="text-sm font-mono text-gray-400 mb-4 flex items-center gap-2">
                <Rocket size={16} className={colors.text} />
                IN-HOUSE PRODUCT SUITE
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-studio-bg/60 p-4 rounded-lg border border-studio-border/50">
                  <div className="w-8 h-8 rounded bg-studio-blue/10 flex items-center justify-center text-studio-blue mb-3">
                    <Monitor size={18} />
                  </div>
                  <strong className="text-sm font-display block">SCA Engine</strong>
                  <span className="text-xs text-gray-400">Our custom visual-kinetic framework that coordinates studio renders.</span>
                </div>
                <div className="bg-studio-bg/60 p-4 rounded-lg border border-studio-border/50">
                  <div className="w-8 h-8 rounded bg-studio-violet/10 flex items-center justify-center text-studio-violet mb-3">
                    <Milestone size={18} />
                  </div>
                  <strong className="text-sm font-display block">Seetusk OS</strong>
                  <span className="text-xs text-gray-400">Interactive web systems designed for campaign metrics distribution.</span>
                </div>
                <div className="bg-studio-bg/60 p-4 rounded-lg border border-studio-border/50">
                  <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center text-pink-500 mb-3">
                    <Zap size={18} />
                  </div>
                  <strong className="text-sm font-display block">Flux Editor</strong>
                  <span className="text-xs text-gray-400">Asset transformation pipeline for lightning-fast creator edits.</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-studio-border">
              <h4 className="text-xs font-mono text-studio-violet uppercase tracking-wider mb-2">FOUNDER COMMENTARY</h4>
              <p className="text-xs text-gray-300 italic">
                "We don't build software to sell SaaS licenses. We build software to multiply the output of our creative studio. We own our tools, our platform, and our distribution."
              </p>
            </div>
          </div>
        );
      case 'craft':
        return (
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-xl border border-studio-border flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-[45%] aspect-video bg-studio-bg rounded-lg border border-studio-border overflow-hidden flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10 transition-opacity group-hover:opacity-70" />
                <span className="absolute z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-transform group-hover:scale-110">
                  <Play size={20} fill="currentColor" />
                </span>
                {/* Background image placeholder */}
                <div className="absolute inset-0 bg-cover bg-center bg-[url('images/sca-logo-mark.png')] opacity-20 filter grayscale" />
                <span className="absolute bottom-3 left-3 z-20 text-[10px] font-mono text-gray-300">PLAY CINEMATIC SHOWCASE // 1:20</span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-display font-bold text-white mb-2">SCA SHOWREEL 2026</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Watch our motion work in action. We don't write specs, we create visual hooks. This reel showcases 12 client campaigns designed, filmed, and shipped inside our Pune studio.
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-studio-bg/60 px-3 py-2 rounded border border-studio-border/30">
                    <span className="text-[10px] text-gray-500 font-mono block">CLIENT</span>
                    <strong>Hindustan Unilever</strong>
                  </div>
                  <div className="bg-studio-bg/60 px-3 py-2 rounded border border-studio-border/30">
                    <span className="text-[10px] text-gray-500 font-mono block">METRIC</span>
                    <strong>120M+ Views</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-xl border border-studio-border">
                <h5 className="text-xs font-mono text-pink-500 uppercase font-bold mb-2">DESIGN SYSTEM ADHERENCE</h5>
                <p className="text-xs text-gray-400">
                  We maintain our own styling rules (Omelette Spec) across every site. High contrast typography, moving gradients, and pointer-following lights are globally standardized.
                </p>
              </div>
              <div className="glass-panel p-5 rounded-xl border border-studio-border">
                <h5 className="text-xs font-mono text-pink-500 uppercase font-bold mb-2">HARDWARE IN HQ</h5>
                <p className="text-xs text-gray-400">
                  RED V-Raptor, Sony FX6 rigs, Aputure 600d lighting clusters, and high-performance RTX render towers. We invest in top tier tools.
                </p>
              </div>
            </div>
          </div>
        );
      case 'room':
        return (
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-xl border border-studio-border">
              <h4 className="text-sm font-mono text-gray-400 mb-4 flex items-center gap-2">
                <MapPin size={16} className={colors.text} />
                PUNE STUDIO HEADQUARTERS
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-bold text-white mb-2">THE GEOGRAPHY</h5>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Based in the cultural heart of Pune, Maharashtra. A 3,200 sq.ft. physical space custom-designed for creators, software engineers, and writers to collaborate with high friction, high velocity.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-studio-panel border border-studio-border rounded text-[10px] font-mono text-studio-signal">18.52° N / 73.85° E</span>
                    <span className="px-2 py-1 bg-studio-panel border border-studio-border rounded text-[10px] font-mono text-studio-signal">3,200 SQ. FT.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="text-xs font-mono text-studio-signal uppercase">SPACE ALLOCATION</h5>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Creative Coding Lab</span>
                        <span>40%</span>
                      </div>
                      <div className="w-full bg-studio-bg rounded-full h-1.5 border border-studio-border/30">
                        <div className="bg-studio-signal h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Production & Shooting Floor</span>
                        <span>35%</span>
                      </div>
                      <div className="w-full bg-studio-bg rounded-full h-1.5 border border-studio-border/30">
                        <div className="bg-studio-signal h-full rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Sound Design & Post Suite</span>
                        <span>25%</span>
                      </div>
                      <div className="w-full bg-studio-bg rounded-full h-1.5 border border-studio-border/30">
                        <div className="bg-studio-signal h-full rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-studio-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-studio-signal" />
                <div>
                  <strong className="text-sm block">14 ACTIVE SEATS</strong>
                  <span className="text-xs text-gray-400">We deliberately cap our room capacity to maintain extremely high quality bar and zero bloat.</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'future':
        return (
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-xl border border-studio-border">
              <h4 className="text-sm font-mono text-gray-400 mb-4 flex items-center gap-2">
                <Target size={16} className={colors.text} />
                THE NEXT MOVES (VISION 2027)
              </h4>
              <div className="space-y-4 text-xs">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-sm text-white block mb-0.5">SCA Creator Network</strong>
                    <p className="text-gray-400">Launching a proprietary distribution network connecting 500+ Indian creators under our software telemetry system to optimize campaigns dynamically.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-sm text-white block mb-0.5">Venture Studio Incubation</strong>
                    <p className="text-gray-400">Spinning out 2 new in-house D2C consumer brands completely designed, coded, and distributed in-house by the Pune studio room.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-sm text-white block mb-0.5">SCA Kinetic Lab Expansion</strong>
                    <p className="text-gray-400">Scaling R&D into WebGL/WebGPU interactive digital canvases for immersive e-commerce brands.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-orange-500/20 bg-orange-500/5 text-center">
              <strong className="text-sm text-orange-500 uppercase block mb-1">JOIN THE AMBITIONS</strong>
              <p className="text-xs text-gray-300">
                We are building the future of digital distribution in India. If these challenges excite you, apply to any open channel below.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#050816]/95 backdrop-blur-xl flex justify-center items-center p-4 md:p-8"
    >
      <motion.div
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-4xl h-[90vh] md:h-[80vh] bg-studio-panel rounded-2xl border border-studio-border overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* Glow overlay */}
        <div className={`absolute top-0 left-1/4 right-1/4 h-24 blur-[80px] pointer-events-none opacity-40 ${colors.bg}`} />

        {/* Modal Header */}
        <div className="p-6 border-b border-studio-border/30 flex justify-between items-start z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`px-2 py-0.5 rounded text-white ${colors.bg}`}>{node.num}</span>
              <span className={`uppercase font-bold tracking-widest ${colors.text}`}>{node.name}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase mt-1.5 tracking-tight">
              {node.tagline}
            </h3>
          </div>

          <button
            onClick={() => {
              onClose();
              playSound('click', soundEnabled);
            }}
            className="p-2 rounded-lg bg-studio-bg border border-studio-border hover:border-red-500/50 hover:text-red-500 transition-all duration-300 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-studio-border/10 flex gap-4 z-10 text-xs font-mono">
          <button
            onClick={() => {
              setActiveTab('content');
              playSound('tick', soundEnabled);
            }}
            className={`py-3 border-b-2 font-bold uppercase transition-all ${
              activeTab === 'content' ? `${colors.text} border-current` : 'text-gray-500 border-transparent'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveTab('stats');
              playSound('tick', soundEnabled);
            }}
            className={`py-3 border-b-2 font-bold uppercase transition-all ${
              activeTab === 'stats' ? `${colors.text} border-current` : 'text-gray-500 border-transparent'
            }`}
          >
            Studio DNA & Culture
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
          {activeTab === 'content' ? (
            renderPanelContent()
          ) : (
            <div className="space-y-6">
              {/* DNA & Culture */}
              <div className="glass-panel p-5 rounded-xl border border-studio-border">
                <h4 className="text-sm font-mono text-gray-400 mb-3 flex items-center gap-2">
                  <Target size={16} className={colors.text} />
                  OUR CORE BELIEFS
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Inside the SeeTusk studio, we reject agency politics, endless client presentation meetings, and bloated project scopes. We focus on building actual assets that drive results.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-studio-signal rounded-full" />
                    <span>Direct founder-engineer alignment</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-studio-signal rounded-full" />
                    <span>Extreme speed and iteration velocity</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-studio-signal rounded-full" />
                    <span>Total ownership over code and styling</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 bg-studio-signal rounded-full" />
                    <span>No black boxes or hidden layers</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border border-studio-border">
                <h4 className="text-sm font-mono text-gray-400 mb-3 flex items-center gap-2">
                  <Award size={16} className={colors.text} />
                  CULTURE ALIGNMENT SCORE
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span>Adherence to Creative High-Fidelity</span>
                      <span>96%</span>
                    </div>
                    <div className="w-full bg-studio-bg rounded-full h-2 border border-studio-border/30">
                      <div className={`h-full rounded-full ${colors.bg}`} style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span>Weekly Shipping Accomplishment</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-studio-bg rounded-full h-2 border border-studio-border/30">
                      <div className={`h-full rounded-full ${colors.bg}`} style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
