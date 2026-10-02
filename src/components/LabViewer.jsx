import React, { useState } from 'react';
import { labExperiments } from '../data/labData';
import { BookOpen, Settings, Code, Copy, CheckCircle2, ChevronRight, Clock, Award } from 'lucide-react';

export function LabViewer() {
  const [selectedLabId, setSelectedLabId] = useState(labExperiments[0].id);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'cube', 'code'
  const [copied, setCopied] = useState(false);

  const lab = labExperiments.find((l) => l.id === selectedLabId) || labExperiments[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lab.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Horizontal Lab Selection Scrollbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md overflow-x-auto text-xs">
        <div className="flex gap-2 min-w-max">
          {labExperiments.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setSelectedLabId(l.id);
                setActiveTab('theory');
              }}
              className={`px-4 py-2.5 rounded-xl border text-left transition flex items-center gap-3 ${
                selectedLabId === l.id
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 border-cyan-400 font-extrabold shadow-lg scale-[1.02]'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                selectedLabId === l.id ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {l.number}
              </span>
              <div>
                <div className="font-bold">{l.title}</div>
                <div className={`text-[10px] ${selectedLabId === l.id ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {l.difficulty} • {l.estimatedTime}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Lab Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        {/* Lab Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold mb-1">
              <span>EXPERIMENT #{lab.number}</span>
              <span>•</span>
              <span className="text-amber-400">{lab.difficulty}</span>
              <span>•</span>
              <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {lab.estimatedTime}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-100">{lab.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{lab.subtitle}</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'theory' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Theory & Pinout
            </button>
            <button
              onClick={() => setActiveTab('cube')}
              className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'cube' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> CubeIDE Setup
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'code' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> C Source Code
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}

        {/* 1. THEORY & OVERVIEW */}
        {activeTab === 'theory' && (
          <div className="mt-6 space-y-6 text-xs">
            {/* Learning Objectives */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" /> LABORATORY OBJECTIVES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lab.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Theoretical Breakdown */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> HARDWARE ARCHITECTURE & THEORY
              </h3>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line text-xs font-mono">
                {lab.theory}
              </div>
            </div>

            {/* Hardware Pin Connection Table */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-400 mb-3">HARDWARE INTERFACE PINOUT TABLE</h3>
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px]">
                      <th className="p-2.5">MCU Pin</th>
                      <th className="p-2.5">Peripheral Mode</th>
                      <th className="p-2.5">External Board Component / Signal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                    {lab.pinConnections.map((pc, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="p-2.5 font-bold text-cyan-400">{pc.pin}</td>
                        <td className="p-2.5 text-amber-300">{pc.function}</td>
                        <td className="p-2.5 text-slate-300">{pc.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. CUBEIDE SETUP GUIDE */}
        {activeTab === 'cube' && (
          <div className="mt-6 space-y-4 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" /> STM32CubeMX Graphical Pinout & Clock Configuration
              </h3>
              <ol className="space-y-3">
                {lab.cubeIdeSetup.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* 3. C CODE SNIPPET */}
        {activeTab === 'code' && (
          <div className="mt-6 space-y-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" /> main.c (STM32 HAL C Driver Code)
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded border border-slate-800 flex items-center gap-1.5 transition text-xs font-bold"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'COPIED TO CLIPBOARD' : 'COPY SOURCE CODE'}
                </button>
              </div>

              <pre className="text-cyan-300 overflow-x-auto p-2 leading-relaxed text-xs font-mono max-h-[550px]">
                {lab.codeSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
