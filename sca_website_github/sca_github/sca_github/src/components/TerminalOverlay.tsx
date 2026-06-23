import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Terminal } from 'lucide-react';
import { playSound } from '../InsideStudio';

interface TerminalOverlayProps {
  onClose: () => void;
  soundEnabled: boolean;
}

const BOOT_LINES = [
  "INITIALIZING SEETUSK OS [V4.0.12]...",
  "RESOLVING HARDWARE ADDRESSES...",
  "GPU CORE LOADED: RENDER_BUFFER_GL_COMPATIBLE",
  "SYNAPSE_GRID ENGINE: OK",
  "THREEJS_ENGINE: 3D GRID SCENE RESOLVED",
  "ESTABLISHING WEB SOCKETS CONSOLE...",
  "WELCOME TO SEETUSK INTERACTIVE TERMINAL.",
  "TYPE 'help' FOR AVAILABLE STUDIO PIPELINE COMMANDS.",
  ""
];

const FACTS = [
  "FACT 01: SeeTusk cap the room size deliberately to 14 active seats to maintain zero administrative bloat.",
  "FACT 02: We ship real work every single week. There are no client-facing 'account managers' — you talk to the builders.",
  "FACT 03: The studio is headquartered in Pune, India, inside a custom-designed 3,200 sq.ft. space.",
  "FACT 04: We build and own three in-house digital products. Team members gain equity in what we build.",
  "FACT 05: Our code follow high-contrast neon styling guidelines inspired by Linear, Stripe, and Apple design standards."
];

export default function TerminalOverlay({ onClose, soundEnabled }: TerminalOverlayProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence animation
  useEffect(() => {
    let currentLineIdx = 0;
    const interval = setInterval(() => {
      if (currentLineIdx < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[currentLineIdx]]);
        currentLineIdx++;
        playSound('tick', soundEnabled);
      } else {
        clearInterval(interval);
        inputRef.current?.focus();
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on output change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    playSound('click', soundEnabled);
    const newOutputs = [`seetusk_os$ ${inputVal}`];

    switch (cmd) {
      case 'help':
        newOutputs.push(
          "Available commands:",
          "  facts  - Display fun secrets & facts about SeeTusk Creative Studio",
          "  clear  - Clear console screen logs",
          "  exit   - Close the SeeTusk OS terminal console"
        );
        break;
      case 'facts':
        newOutputs.push(...FACTS);
        break;
      case 'clear':
        setLines([]);
        setInputVal('');
        return;
      case 'exit':
        onClose();
        return;
      default:
        newOutputs.push(`Command not recognized: '${cmd}'. Type 'help' for instructions.`);
    }

    setLines(prev => [...prev, ...newOutputs]);
    setInputVal('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-[#050816]/95 backdrop-blur-md flex justify-center items-center p-4 md:p-8"
      onClick={() => inputRef.current?.focus()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="w-full max-w-2xl h-[70vh] bg-black border border-green-500/30 rounded-lg overflow-hidden flex flex-col shadow-[0_0_40px_rgba(57,255,20,0.15)] relative font-mono text-studio-signal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CRT Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] z-30" />
        
        {/* Terminal Header */}
        <div className="bg-zinc-900 px-4 py-3 border-b border-green-500/25 flex justify-between items-center z-10">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Terminal size={14} className="text-studio-signal animate-pulse" />
            <span>SEETUSK OS TERMINAL CONSOLE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-zinc-800 text-gray-500 hover:text-studio-signal transition-colors duration-200"
          >
            <X size={14} />
          </button>
        </div>

        {/* Output lines */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 text-sm z-10">
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-relaxed">
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <form onSubmit={handleCommandSubmit} className="p-5 border-t border-green-500/25 bg-zinc-950 flex items-center gap-2 z-10">
          <span className="text-studio-signal">seetusk_os$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-studio-signal caret-studio-signal text-sm placeholder-green-500/30"
            placeholder="Type 'facts', 'help' or 'exit'..."
            autoFocus
          />
        </form>
      </motion.div>
    </motion.div>
  );
}
