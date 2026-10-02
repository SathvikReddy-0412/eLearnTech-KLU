import React, { useState, useEffect } from 'react';
import { labExperiments } from '../data/labData';
import { Award, CheckCircle2, XCircle, HelpCircle, FileText, Download, RotateCcw } from 'lucide-react';

export function QuizEngine({ onOpenReportModal }) {
  const [selectedLabId, setSelectedLabId] = useState(labExperiments[0].id);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  const currentLab = labExperiments.find((l) => l.id === selectedLabId) || labExperiments[0];

  const handleSelectOption = (labId, qIdx, optIdx) => {
    if (submitted[labId]) return; // Prevent changing after submission
    setAnswers((prev) => ({
      ...prev,
      [`${labId}_${qIdx}`]: optIdx
    }));
  };

  const handleSubmitQuiz = (labId) => {
    setSubmitted((prev) => ({ ...prev, [labId]: true }));
  };

  const handleResetQuiz = (labId) => {
    setSubmitted((prev) => ({ ...prev, [labId]: false }));
    const newAnswers = { ...answers };
    currentLab.quiz.forEach((_, qIdx) => {
      delete newAnswers[`${labId}_${qIdx}`];
    });
    setAnswers(newAnswers);
  };

  // Calculate score for current lab
  const getLabScore = (labId) => {
    const lab = labExperiments.find((l) => l.id === labId);
    if (!lab) return 0;
    let score = 0;
    lab.quiz.forEach((q, idx) => {
      if (answers[`${labId}_${idx}`] === q.correct) score++;
    });
    return score;
  };

  // Total completed labs
  const totalCompletedLabs = Object.keys(submitted).filter((k) => submitted[k]).length;

  return (
    <div className="space-y-6 font-mono">
      {/* Quiz Portal Header & Overall Score */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-400" /> Student Self-Assessment & Knowledge Checks
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test your understanding of STM32 Cortex-M7 hardware registers, peripherals, and HAL code
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400">LABS COMPLETED</div>
              <div className="text-lg font-bold text-cyan-400">{totalCompletedLabs} / {labExperiments.length}</div>
            </div>

            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <FileText className="w-4 h-4" /> EXPORT LAB REPORT
            </button>
          </div>
        </div>

        {/* Lab Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 text-xs">
          {labExperiments.map((lab) => {
            const isDone = submitted[lab.id];
            const score = getLabScore(lab.id);
            return (
              <button
                key={lab.id}
                onClick={() => setSelectedLabId(lab.id)}
                className={`px-3 py-2 rounded-xl border font-bold transition flex items-center gap-2 ${
                  selectedLabId === lab.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                    : isDone
                    ? 'bg-slate-900 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Lab {lab.number}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quiz Content Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">QUIZ FOR LAB {currentLab.number}</span>
            <h3 className="text-lg font-black text-slate-100">{currentLab.title}</h3>
          </div>

          {submitted[currentLab.id] && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-emerald-400">
                Score: {getLabScore(currentLab.id)} / {currentLab.quiz.length}
              </span>
              <button
                onClick={() => handleResetQuiz(currentLab.id)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> RETAKE
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {currentLab.quiz.map((q, qIdx) => {
            const key = `${currentLab.id}_${qIdx}`;
            const selectedOpt = answers[key];
            const isSubmitted = submitted[currentLab.id];

            return (
              <div key={qIdx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-200 flex items-start gap-2">
                  <span className="text-cyan-400">Q{qIdx + 1}.</span> {q.question}
                </h4>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isChosen = selectedOpt === optIdx;
                    const isCorrect = q.correct === optIdx;

                    let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                      } else if (isChosen && !isCorrect) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      }
                    } else if (isChosen) {
                      btnStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentLab.id, qIdx, optIdx)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </span>

                        {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation Box */}
                {isSubmitted && (
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 mt-2">
                    <span className="text-cyan-400 font-bold block mb-1">Explanation:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Action Button */}
        {!submitted[currentLab.id] && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => handleSubmitQuiz(currentLab.id)}
              disabled={Object.keys(answers).filter((k) => k.startsWith(currentLab.id)).length < currentLab.quiz.length}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition shadow-lg"
            >
              SUBMIT ANSWERS & EVALUATE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
