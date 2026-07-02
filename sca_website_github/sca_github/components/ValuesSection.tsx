import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ValueItemData {
  num: string;
  title: string;
  description: string;
  quote: string;
  author: string;
  visualCompanion: React.ReactNode;
}

export function ValuesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const values: ValueItemData[] = [
    {
      num: '01',
      title: 'Taste over volume.',
      description: "We'd rather ship three great things than twelve mediocre ones. Agencies that bill by output die slow deaths.",
      quote: "Simplicity is the ultimate sophistication.",
      author: "Leonardo da Vinci",
      visualCompanion: (
        <div className="relative w-full h-full min-h-[140px] flex items-center justify-center overflow-hidden rounded-xl bg-[#111214]/50 border border-white/5 p-4">
          <div className="absolute inset-0 bg-radial-gradient from-orange-500/5 to-transparent" />
          <svg className="w-20 h-20 text-[#FF6B35]/20" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
      )
    },
    {
      num: '02',
      title: 'Write it down.',
      description: "Strategy you can't write is strategy you don't have. Every engagement produces a doc someone on the client side can defend in a meeting.",
      quote: "Clear thinking becomes clear writing; one can't exist without the other.",
      author: "SCA Principle",
      visualCompanion: (
        <div className="relative w-full h-full min-h-[140px] flex items-center justify-center overflow-hidden rounded-xl bg-[#111214]/50 border border-white/5 p-4">
          <div className="absolute top-2 left-4 text-[#FF6B35]/10 text-8xl font-serif font-bold select-none">“</div>
          <div className="text-center px-6 z-10">
            <div className="w-12 h-[1px] bg-[#FF6B35]/30 mx-auto mb-3" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#80858D]">A4 Strategy Document</span>
          </div>
        </div>
      )
    },
    {
      num: '03',
      title: 'Ship weekly.',
      description: "Anything that can't be reviewed once a week compounds into a mess by month three. Public roadmap. No black boxes.",
      quote: "Real artists ship.",
      author: "Steve Jobs",
      visualCompanion: (
        <div className="relative w-full h-full min-h-[140px] flex items-center justify-center overflow-hidden rounded-xl bg-[#111214]/50 border border-white/5 p-4">
          <svg className="w-20 h-20 text-[#FF6B35]/30" viewBox="0 0 100 100" fill="none">
            <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="5" fill="currentColor" className="animate-pulse" />
          </svg>
        </div>
      )
    },
    {
      num: '04',
      title: 'No vanity metrics.',
      description: "If it doesn't show up in revenue, pipeline, or brand search, it's not a KPI. It's a screenshot.",
      quote: "Focus on the numbers that move the needle, not the ones that stroke the ego.",
      author: "SCA Metric Rule",
      visualCompanion: (
        <div className="relative w-full h-full min-h-[140px] flex items-center justify-center overflow-hidden rounded-xl bg-[#111214]/50 border border-white/5 p-4">
          <svg className="w-20 h-16 text-[#FF6B35]/25" viewBox="0 0 100 50" fill="none">
            <line x1="0" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="1" />
            <path d="M0,45 L20,35 L40,40 L60,20 L80,25 L100,5" stroke="#FF6B35" strokeWidth="1.5" opacity="0.6" />
            <circle cx="100" cy="5" r="3" fill="#FF6B35" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24" id="values">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Sticky Left Column */}
        <div className="lg:col-span-4 flex flex-col justify-between lg:sticky lg:top-32 lg:h-[calc(100vh-200px)]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B35]">03 / Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 text-white uppercase font-sans">
              Our Core<br />Values
            </h2>
            <div className="w-12 h-[2px] bg-[#FF6B35] mt-6 animate-width" />
          </div>
          
          <div className="hidden lg:block mt-8">
            <p className="font-serif text-sm italic text-[#80858D] leading-relaxed max-w-[280px]">
              How we work is how we think. These four non-negotiables define every client engagement.
            </p>
          </div>
        </div>

        {/* Accordion List Right Column */}
        <div className="lg:col-span-8 flex flex-col border-t border-white/10">
          {values.map((val, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="border-b border-white/10 group cursor-pointer transition-all duration-300"
                onClick={() => setActiveIndex(isOpen ? null : idx)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen ? "true" : "false"}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndex(isOpen ? null : idx);
                  }
                }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between py-8 transition-all duration-300 group-hover:translate-x-4">
                  <div className="flex items-center gap-6 md:gap-8">
                    <span className="font-mono text-xs text-[#FF6B35] tracking-widest">{val.num}</span>
                    <h3 className="font-serif text-2xl md:text-3.5xl lg:text-4xl text-white font-light italic transition-colors duration-300 group-hover:text-[#FF6B35]">
                      {val.title}
                    </h3>
                  </div>
                  
                  {/* Chevron button */}
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-[#FF6B35]/30">
                    <svg
                      className={`w-4 h-4 text-[#B7BDC6] transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#FF6B35]' : 'group-hover:rotate-45'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Animated expandable content drawer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-8 md:pl-12 pr-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        
                        {/* Philosophy Description + Quote */}
                        <div className="md:col-span-8 flex flex-col gap-6">
                          <p className="font-serif text-lg text-[#B7BDC6] leading-relaxed">
                            {val.description}
                          </p>
                          
                          {val.quote && (
                            <div className="border-l-2 border-[#FF6B35]/40 pl-4 py-1">
                              <p className="font-serif text-base italic text-[#80858D] leading-relaxed">
                                "{val.quote}"
                              </p>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6B35]/70 mt-1 block">
                                — {val.author}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Visual Companion / Graphic */}
                        <div className="md:col-span-4 flex items-center justify-center w-full">
                          {val.visualCompanion}
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
