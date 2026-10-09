import React from 'react';
import { Cpu, BookOpen, GraduationCap, Pin, Calculator, Award, FileText, Zap, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Navbar({ activeTab, setActiveTab, onOpenReportModal, onOpenSearchModal }) {
  const { theme, toggleTheme, isDark } = useTheme();

  const navItems = [
    { id: 'overview', label: 'HOME', icon: Cpu },
    { id: 'labs', label: 'EXPERIMENTS', icon: BookOpen },
    { id: 'courses', label: 'COURSES', icon: GraduationCap },
    { id: 'quizzes', label: 'QUIZZES & AI', icon: Award },
    { id: 'pinout', label: 'PINOUT EXPLORER', icon: Pin },
    { id: 'calculators', label: 'CALCULATORS', icon: Calculator }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Text */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group py-1 shrink-0"
            title="eLearnTech — Home Overview"
          >
            <img
              src="/logo-icon-transparent.png"
              alt="eLearnTech Emblem"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.35)]"
            />
            <div className="flex flex-col justify-center">
              <div className="font-mono font-black text-slate-100 text-sm sm:text-base tracking-wide flex items-center gap-1.5 leading-tight">
                eLearnTech
              </div>
              <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 font-medium tracking-tight hidden md:block">
                TECHNOLOGY ENABLED LEARNING & GLOBAL ENGAGEMENT
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
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

          {/* Right Action Buttons: Global Search + Theme + Report */}
          <div className="flex items-center gap-2 font-mono shrink-0">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearchModal}
              title="Search Courses, Experiments, Pinout Signals (Ctrl+K)"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-xs text-slate-300 hover:text-cyan-400 flex items-center gap-2 transition shadow-md"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline font-medium">Search...</span>
              <span className="hidden sm:inline text-[9px] bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                ⌘K
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300 shadow-md flex items-center justify-center group"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-600 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Export Report Button */}
            <button
              onClick={onOpenReportModal}
              className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Lab Report</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 font-mono text-xs">
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
