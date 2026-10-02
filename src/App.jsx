import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BoardOverview } from './components/BoardOverview';
import { LabViewer } from './components/LabViewer';
import { PinoutVisualizer } from './components/PinoutVisualizer';
import { Calculators } from './components/Calculators';
import { QuizEngine } from './components/QuizEngine';
import { LabReportModal } from './components/LabReportModal';
import { Cpu, ExternalLink, Heart, BookOpen, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Container Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'overview' && <BoardOverview />}
        {activeTab === 'labs' && <LabViewer />}
        {activeTab === 'pinout' && <PinoutVisualizer />}
        {activeTab === 'calculators' && <Calculators />}
        {activeTab === 'quizzes' && (
          <QuizEngine onOpenReportModal={() => setIsReportModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>eLearnTech@KLU — STM32 NUCLEO-H753ZI Microcontroller Portal</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <a
              href="https://www.st.com/en/evaluation-boards/nucleo-h753zi.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition flex items-center gap-1"
            >
              ST Official Datasheet <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>KLU ECE Embedded Systems Course</span>
          </div>
        </div>
      </footer>

      {/* Lab Report Export Modal */}
      <LabReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
