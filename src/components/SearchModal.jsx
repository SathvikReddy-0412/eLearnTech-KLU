import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, GraduationCap, Pin, Calculator, Award, Cpu, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { labExperiments } from '../data/labData';
import { coursesData } from '../data/coursesData';
import { nucleoPinout, boardSpecs } from '../data/pinoutData';

export function SearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate('search-open');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search Results Filtering
  const matchingExperiments = q
    ? labExperiments.filter(
        (lab) =>
          lab.title.toLowerCase().includes(q) ||
          lab.description?.toLowerCase().includes(q) ||
          lab.category?.toLowerCase().includes(q) ||
          lab.difficulty?.toLowerCase().includes(q) ||
          `exp ${lab.number}`.includes(q)
      )
    : labExperiments.slice(0, 4);

  const matchingCourses = q
    ? coursesData.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.modules.some((m) => m.name.toLowerCase().includes(q) || m.topics.some((t) => t.toLowerCase().includes(q)))
      )
    : coursesData;

  const matchingPinouts = q
    ? nucleoPinout.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.connector.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.alt.some((a) => a.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  const matchingCalculators = q
    ? [
        { id: 'baud', name: 'Baud Rate Generator Calculator', desc: 'USART/UART prescaler & baud rate error calculation', category: 'Calculators' },
        { id: 'timer', name: 'Timer Prescaler & ARR Calculator', desc: 'Compute TIM prescaler, auto-reload, and PWM frequency', category: 'Calculators' },
        { id: 'adc', name: 'ADC Conversion Time Calculator', desc: 'Calculate sample cycles, sampling time, and throughput', category: 'Calculators' },
        { id: 'pwm', name: 'PWM Duty Cycle Calculator', desc: 'Channel compare values and duty cycle percentages', category: 'Calculators' }
      ].filter((calc) => calc.name.toLowerCase().includes(q) || calc.desc.toLowerCase().includes(q))
    : [];

  const totalResults = q
    ? matchingExperiments.length + matchingCourses.length + matchingPinouts.length + matchingCalculators.length
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto font-mono">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Courses, Experiments, Pinout Signals, Calculators, Specs..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none text-sm font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
            ESC
          </span>
        </div>

        {/* Search Results Container */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
          {!q && (
            <div className="text-slate-500 text-center py-6 space-y-3">
              <Zap className="w-8 h-8 text-cyan-500/50 mx-auto animate-pulse" />
              <p className="text-slate-400 text-xs">
                Type keywords to search across <span className="text-cyan-400 font-bold">Courses</span>, <span className="text-emerald-400 font-bold">26 STM32 Experiments</span>, and <span className="text-purple-400 font-bold">Pinouts & Tools</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['FreeRTOS', 'ADC DMA', 'ELGE-301', 'PWM Calculator', 'Cryptographic AES', 'PB0 Green LED'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 border border-slate-700 rounded-lg text-[11px] text-slate-300 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <p className="text-sm font-bold text-slate-300">No matching website content found</p>
              <p className="text-xs text-slate-500">Try searching for terms like "GPIO", "ELGE-302", "Timer", or "USART".</p>
            </div>
          )}

          {/* Matching Courses */}
          {matchingCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Courses ({matchingCourses.length})
                </span>
                <span className="text-slate-500">Human & AI Curriculum</span>
              </div>
              <div className="grid gap-2">
                {matchingCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      onNavigate('courses', course.id);
                      onClose();
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-extrabold text-[10px]">
                          {course.code}
                        </span>
                        <span className="font-bold text-slate-200 group-hover:text-cyan-400 transition">{course.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{course.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Experiments */}
          {matchingExperiments.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Lab Experiments ({matchingExperiments.length})
                </span>
                <span className="text-slate-500">Hardware & Code Manual</span>
              </div>
              <div className="grid gap-2">
                {matchingExperiments.map((lab) => (
                  <div
                    key={lab.id}
                    onClick={() => {
                      onNavigate('labs', lab.id);
                      onClose();
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black text-[10px]">
                          EXP #{lab.number}
                        </span>
                        <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition">{lab.title}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {lab.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{lab.objective || lab.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Pinout Signals */}
          {matchingPinouts.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5" /> Hardware Pinout Signals ({matchingPinouts.length})
              </div>
              <div className="grid gap-2">
                {matchingPinouts.map((pin) => (
                  <div
                    key={pin.id}
                    onClick={() => {
                      onNavigate('pinout', pin.id);
                      onClose();
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-400">{pin.name}</span>
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                          {pin.connector}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{pin.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Calculators */}
          {matchingCalculators.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" /> Hardware Calculators ({matchingCalculators.length})
              </div>
              <div className="grid gap-2">
                {matchingCalculators.map((calc) => (
                  <div
                    key={calc.id}
                    onClick={() => {
                      onNavigate('calculators', calc.id);
                      onClose();
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-amber-400 transition">{calc.name}</div>
                      <p className="text-[11px] text-slate-400 mt-1">{calc.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>eLearnTech Search Engine — Powered by Human & AI Indexing</span>
          </div>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
