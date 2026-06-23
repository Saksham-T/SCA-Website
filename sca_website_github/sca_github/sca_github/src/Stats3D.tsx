import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import StatsCanvas from './components/StatsCanvas';
import StatsModals from './components/StatsModals';

export type StatKey = 'roles' | 'depts' | 'team' | 'reply';

export interface StatCardData {
  id: StatKey;
  num: string;
  name: string;
  value: string;
  unit?: string;
  bgGlow: string;
  label: string;
}

export const STATS_DATA: Record<StatKey, StatCardData> = {
  roles: {
    id: 'roles',
    num: '01',
    name: 'OPEN ROLES',
    value: '13',
    bgGlow: 'rgba(46, 84, 234, 0.4)',
    label: 'LIVE CHANNELS'
  },
  depts: {
    id: 'depts',
    num: '02',
    name: 'DEPARTMENTS',
    value: '4',
    bgGlow: 'rgba(168, 85, 247, 0.4)',
    label: 'STUDIO BRANCHES'
  },
  team: {
    id: 'team',
    num: '03',
    name: 'ON THE TEAM',
    value: '14',
    bgGlow: 'rgba(57, 255, 20, 0.4)',
    label: 'ACTIVE SEATS'
  },
  reply: {
    id: 'reply',
    num: '04',
    name: 'REPLY TIME',
    value: '48',
    unit: 'HRS',
    bgGlow: 'rgba(252, 114, 51, 0.4)',
    label: 'FOUNDER SLA'
  }
};

// Local Synthesizer Audio Helper
const playSound = (type: 'tick' | 'click' | 'powerup') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    // Audio context may be blocked by browser policy until interaction
  }
};

export default function Stats3D() {
  const [activeStat, setActiveStat] = useState<StatKey | null>(null);
  const [hoveredStat, setHoveredStat] = useState<StatKey | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStatClick = (key: StatKey) => {
    setActiveStat(key);
    playSound('click');
  };

  const handleStatHover = (key: StatKey | null) => {
    setHoveredStat(key);
    if (key) playSound('tick');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[150px] bg-transparent overflow-hidden rounded-xl border border-studio-border/30"
      style={{
        background: 'rgba(5, 8, 22, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      {/* 3D R3F Stats Canvas */}
      <StatsCanvas
        hoveredStat={hoveredStat}
        setHoveredStat={handleStatHover}
        onStatClick={handleStatClick}
        mousePos={mousePos}
      />

      {/* Stats Detail Modal Overlay */}
      <AnimatePresence>
        {activeStat && (
          <StatsModals
            statKey={activeStat}
            data={STATS_DATA[activeStat]}
            onClose={() => {
              setActiveStat(null);
              playSound('click');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
