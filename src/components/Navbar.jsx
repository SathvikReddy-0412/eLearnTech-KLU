import React from 'react';
import { Cpu, BookOpen, Pin, Calculator, Award, FileText, Zap } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onOpenReportModal }) {
  const navItems = [
    { id: 'overview', label: 'Board Specs', icon: Cpu },
    { id: 'labs', label: 'Lab Experiments (1-26)', icon: BookOpen },
    { id: 'pinout', label: 'Pinout Explorer', icon: Pin },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'quizzes', label: 'Quizzes & Assessment', icon: Award }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition duration-300" />
              </div>
            </div>
            <div>
              <div className="font-mono font-black text-slate-100 text-sm tracking-wide flex items-center gap-1.5">
                eLearnTech<span className="text-cyan-400">@KLU</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">STM32 H7 Microcontroller Lab Portal</div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Export Button */}
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Lab Report</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
