import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BoardOverview } from './components/BoardOverview';
import { LabViewer } from './components/LabViewer';
import { Courses } from './components/Courses';
import { PinoutVisualizer } from './components/PinoutVisualizer';
import { Calculators } from './components/Calculators';
import { QuizEngine } from './components/QuizEngine';
import { LabReportModal } from './components/LabReportModal';
import { SearchModal } from './components/SearchModal';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState(null);

  const handleNavigate = (tab, targetId) => {
    if (tab === 'search-open') {
      setIsSearchModalOpen(true);
      return;
    }
    setActiveTab(tab);
    if (tab === 'labs' && targetId) {
      setSelectedLabId(targetId);
    }
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* Hero Background Banner Section (Matching Reference Theme) */}
      <div className="relative border-b-2 border-cyan-500/80 shadow-[0_4px_25px_rgba(6,182,212,0.2)]">
        <div className="hero-glow-bg relative py-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              STM32 Embedded Lab
            </h1>
            <p className="text-sm sm:text-base font-mono text-slate-300 max-w-2xl mx-auto font-medium">
              Human-Curated Learning & AI-Powered Microcontroller Platform.
            </p>
          </div>
        </div>
        {/* Glowing Cyan Line Accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 shadow-[0_0_12px_#06b6d4]" />
      </div>

      {/* Main Container Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'overview' && (
          <BoardOverview onNavigate={handleNavigate} />
        )}

        {activeTab === 'labs' && (
          <LabViewer initialLabId={selectedLabId} />
        )}

        {activeTab === 'courses' && (
          <Courses
            onSelectLab={(labId) => handleNavigate('labs', labId)}
            onLaunchQuiz={(courseCode) => handleNavigate('quizzes', courseCode)}
          />
        )}

        {activeTab === 'pinout' && <PinoutVisualizer />}
        {activeTab === 'calculators' && <Calculators />}
        
        {activeTab === 'quizzes' && (
          <QuizEngine onOpenReportModal={() => setIsReportModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#060911] border-t border-slate-900 py-8 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <img
              src="/logo-icon-transparent.png"
              alt="eLearnTech@KLU Emblem"
              className="w-7 h-7 object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.3)]"
            />
            <span className="font-mono text-slate-300 font-bold">
              eLearnTech<span className="text-cyan-400">@kl</span> — Koneru Lakshmaiah Education Foundation
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 text-slate-400">
            <a
              href="https://www.st.com/en/evaluation-boards/nucleo-h753zi.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition flex items-center gap-1"
            >
              ST Official Datasheet <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-cyan-400 font-semibold">KLU EL&GE</span>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-slate-500">Mentor:</span>
              <span className="text-slate-300 font-medium">Dr. Aswinkumer S V</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-slate-500">Contributors:</span>
              <span className="text-slate-300 font-medium">Sathvik, Harshitha, Deepthi</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Lab Report Export Modal */}
      <LabReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
