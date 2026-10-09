import React, { useState } from 'react';
import { labExperiments } from '../data/labData';
import { X, Printer, Download, CheckCircle, Award, Cpu } from 'lucide-react';

export function LabReportModal({ isOpen, onClose }) {
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [studentId, setStudentId] = useState('2026-EE-4091');
  const [courseName, setCourseName] = useState('ECE 432: Embedded Microcontroller Systems');
  const [university, setUniversity] = useState('Department of Electrical & Computer Engineering');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl p-6 shadow-2xl font-mono text-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-slate-800 mb-6">
          <h3 className="text-lg font-black text-cyan-400 flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" /> Student Official Lab Progress Summary Report
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Generate printable laboratory submission document for eLearnTech course evaluation
          </p>
        </div>

        {/* Printable Document Box */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6 text-xs" id="printable-report">
          {/* Institution Header */}
          <div className="text-center border-b border-slate-800 pb-4 space-y-3">
            <div className="flex justify-center items-center gap-3">
              <img
                src="/logo-icon-transparent.png"
                alt="eLearnTech Emblem"
                className="h-12 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              />
              <div className="text-left">
                <div className="font-mono font-black text-slate-100 text-lg tracking-tight flex items-center gap-1.5">
                  eLearnTech
                </div>
                <div className="text-[10px] font-mono text-slate-400 font-semibold tracking-wide">
                  TECHNOLOGY ENABLED LEARNING & GLOBAL ENGAGEMENT
                </div>
              </div>
            </div>
            <div className="text-cyan-400 font-extrabold text-sm tracking-wide">
              {university.toUpperCase()}
            </div>
            <div className="text-slate-300 font-bold">{courseName}</div>
            <div className="text-slate-500 text-[10px]">STM32 NUCLEO-H753ZI LABORATORY EVALUATION MANUAL</div>
          </div>

          {/* Editable Student Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-lg border border-slate-800 print:hidden">
            <div>
              <label className="text-slate-400 block mb-1 text-[10px]">STUDENT FULL NAME:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-cyan-300 rounded p-1.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 text-[10px]">STUDENT ID / ROLL NO:</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-cyan-300 rounded p-1.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Student Info Card (Print view) */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-slate-400 block text-[10px]">STUDENT NAME</span>
              <span className="text-cyan-300 font-bold text-sm">{studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">STUDENT ID</span>
              <span className="text-cyan-300 font-bold text-sm">{studentId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TARGET PLATFORM</span>
              <span className="text-slate-200">STM32 NUCLEO-H753ZI (Cortex-M7)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TIMESTAMP</span>
              <span className="text-slate-200">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Completed Experiments Summary Table */}
          <div>
            <h4 className="font-bold text-cyan-400 mb-3 text-xs">LAB EXPERIMENT COMPLETION STATUS</h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th className="p-2.5">Lab #</th>
                    <th className="p-2.5">Topic & Peripheral</th>
                    <th className="p-2.5">Difficulty</th>
                    <th className="p-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {labExperiments.map((lab) => (
                    <tr key={lab.id} className="hover:bg-slate-900/40">
                      <td className="p-2.5 font-bold text-cyan-400">Lab {lab.number}</td>
                      <td className="p-2.5 text-slate-200">{lab.title}</td>
                      <td className="p-2.5 text-slate-400">{lab.difficulty}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-400">
                        COMPLETED
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructor Sign-off Box */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-8 text-[11px] text-slate-400">
            <div>
              <div className="border-b border-slate-700 h-8 mb-1" />
              <span>Student Signature</span>
            </div>
            <div>
              <div className="border-b border-slate-700 h-8 mb-1" />
              <span>Lab Instructor / TA Sign-Off</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
          >
            CLOSE
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg"
          >
            <Printer className="w-4 h-4" /> PRINT / SAVE AS PDF
          </button>
        </div>
      </div>
    </div>
  );
}
