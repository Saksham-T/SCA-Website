import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, CheckCircle, Zap, ShieldAlert, Award, Clock, ArrowRight } from 'lucide-react';
import { StatCardData } from '../Stats3D';

interface StatsModalsProps {
  statKey: string;
  data: StatCardData;
  onClose: () => void;
}

export default function StatsModals({ statKey, data, onClose }: StatsModalsProps) {
  // ESC key listener already handled in parent or here
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Color mappings
  const getColorClasses = () => {
    switch (statKey) {
      case 'roles':
        return { text: 'text-studio-blue', bg: 'bg-studio-blue', border: 'border-studio-blue/30' };
      case 'depts':
        return { text: 'text-studio-violet', bg: 'bg-studio-violet', border: 'border-studio-violet/30' };
      case 'team':
        return { text: 'text-studio-signal', bg: 'bg-studio-signal', border: 'border-studio-signal/30' };
      case 'reply':
        return { text: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/30' };
      default:
        return { text: 'text-studio-blue', bg: 'bg-studio-blue', border: 'border-studio-blue/30' };
    }
  };

  const colors = getColorClasses();

  // Content renderers
  const renderContent = () => {
    switch (statKey) {
      case 'roles':
        return <RolesDetail />;
      case 'depts':
        return <DeptsDetail />;
      case 'team':
        return <TeamDetail />;
      case 'reply':
        return <ReplyDetail />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex justify-center items-center p-4"
    >
      <motion.div
        initial={{ y: 30, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-lg bg-studio-panel border border-studio-border rounded-xl shadow-2xl overflow-hidden flex flex-col relative text-white"
      >
        {/* Glow overlay */}
        <div className={`absolute top-0 left-1/4 right-1/4 h-16 blur-[50px] pointer-events-none opacity-20 ${colors.bg}`} />

        {/* Modal Header */}
        <div className="p-5 border-b border-studio-border/20 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
            <span className="text-[10px] font-mono tracking-widest text-gray-400 font-extrabold uppercase">
              {data.name} // METRIC DETAIL
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md bg-studio-bg border border-studio-border/50 text-gray-500 hover:text-white transition-colors duration-200"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 z-10 max-h-[60vh]">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}

// 1. Roles Modal
const ROLES_LIST = [
  { title: "Senior Brand Manager", dept: "Marketing", type: "Full-time" },
  { title: "Cinematographer", dept: "Production & Post", type: "Full-time" },
  { title: "Sr. Video Editor", dept: "Production & Post", type: "Full-time" },
  { title: "Intermediate Video Editor", dept: "Production & Post", type: "Full-time" },
  { title: "Creative Developer", dept: "Growth & Tech", type: "Full-time" }
];

function RolesDetail() {
  const [search, setSearch] = useState('');
  const filtered = ROLES_LIST.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative flex items-center bg-studio-bg border border-studio-border/55 rounded px-3 py-1.5 text-xs text-gray-400">
        <Search size={14} className="mr-2 text-studio-blue" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter active channels..."
          className="bg-transparent border-none outline-none text-white w-full"
        />
      </div>
      <div className="space-y-2">
        {filtered.map((role, i) => (
          <div key={i} className="flex justify-between items-center bg-studio-bg/60 border border-studio-border/20 rounded p-3 text-xs">
            <div>
              <strong className="block text-white font-display text-sm">{role.title}</strong>
              <span className="text-[10px] text-gray-500 font-mono uppercase">{role.dept}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-studio-blue/15 text-studio-blue font-mono text-[9px] border border-studio-blue/25 uppercase">
              {role.type}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-xs text-gray-500 py-4">// No active channels match that criteria.</p>
        )}
      </div>
    </div>
  );
}

// 2. Departments Modal
function DeptsDetail() {
  const depts = [
    { name: "Marketing & Strategy", count: "3 roles", active: "92%" },
    { name: "Production & Post-production", count: "7 roles", active: "96%" },
    { name: "Growth & Technology", count: "2 roles", active: "88%" },
    { name: "Studio Operations", count: "1 role", active: "95%" }
  ];

  return (
    <div className="space-y-4 text-xs font-mono">
      {depts.map((d, i) => (
        <div key={i} className="bg-studio-bg/60 border border-studio-border/20 rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-white text-sm font-display font-semibold">{d.name}</strong>
            <span className="text-studio-violet">{d.count}</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Capacity Allocation</span>
            <span>{d.active}</span>
          </div>
          <div className="w-full bg-studio-bg h-1.5 rounded-full border border-studio-border/30">
            <div className="bg-studio-violet h-full rounded-full" style={{ width: d.active }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 3. Team Modal
const TEAM_LIST = [
  { name: "Sarthak", role: "Founder / Strategy", initials: "SK" },
  { name: "Saksham", role: "Creative Engineering", initials: "SM" },
  { name: "Parag", role: "Visual Design & UI", initials: "PD" },
  { name: "Melbin", role: "Copy & Campaigns", initials: "MB" },
  { name: "Crew Member A", role: "Motion Designer", initials: "CM" },
  { name: "Crew Member B", role: "Cinematographer", initials: "CB" }
];

function TeamDetail() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {TEAM_LIST.map((member, i) => (
          <div key={i} className="bg-studio-bg/60 border border-studio-border/20 rounded p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-studio-signal/15 text-studio-signal font-mono text-xs border border-studio-signal/35 flex items-center justify-center font-bold">
              {member.initials}
            </div>
            <div className="overflow-hidden">
              <strong className="block text-xs text-white truncate">{member.name}</strong>
              <span className="text-[9px] text-gray-500 block truncate">{member.role}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center p-2 border border-studio-border/30 bg-studio-signal/5 text-studio-signal font-mono text-[10px] uppercase rounded">
        Studio capped strictly to 14 active desks.
      </div>
    </div>
  );
}

// 4. Reply SLA Modal
function ReplyDetail() {
  return (
    <div className="space-y-5">
      <div className="text-center bg-orange-500/10 border border-orange-500/30 p-4 rounded text-xs text-orange-500 font-mono">
        <Clock size={20} className="mx-auto mb-2" />
        <strong>48 HOUR SLA PIPELINE LOG</strong>
        <p className="text-[10px] text-gray-400 mt-1">We read every application. A founder will reply with a decision within 48 business hours.</p>
      </div>

      <div className="space-y-3.5 text-xs font-mono">
        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-studio-bg border border-orange-500/50 flex items-center justify-center text-[10px] text-orange-500 font-bold flex-shrink-0">
            01
          </div>
          <div>
            <strong className="text-white block">INITIAL LOGGING (0-2 Hrs)</strong>
            <span className="text-[10px] text-gray-500">Pipeline receives profile transmission. Auto-checking variables.</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-studio-bg border border-orange-500/50 flex items-center justify-center text-[10px] text-orange-500 font-bold flex-shrink-0">
            02
          </div>
          <div>
            <strong className="text-white block">FOUNDER REVIEW (2-24 Hrs)</strong>
            <span className="text-[10px] text-gray-500">Sarthak reviews portfolio metrics. Work evaluated directly.</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-studio-bg border border-orange-500/50 flex items-center justify-center text-[10px] text-orange-500 font-bold flex-shrink-0">
            03
          </div>
          <div>
            <strong className="text-white block">RESOLUTION TRANSMITTED (24-48 Hrs)</strong>
            <span className="text-[10px] text-gray-500">Scheduling invitation or structured rejection reply is delivered.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
