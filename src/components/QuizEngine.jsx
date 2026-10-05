import React, { useState, useEffect } from 'react';
import { labExperiments } from '../data/labData';
import { Award, CheckCircle2, XCircle, HelpCircle, FileText, Download, RotateCcw, Sparkles, Zap, ShieldCheck, Clock, RefreshCw, Cpu, BookOpen } from 'lucide-react';

// Extensive Question Bank for AI Dynamic Quiz Engine
const aiQuestionBank = [
  {
    topic: 'ARM Cortex-M7 Core',
    difficulty: 'Intermediate',
    question: 'What is the primary role of the L1 Instruction Cache in the ARM Cortex-M7 processor?',
    options: [
      'To accelerate instruction fetches from slow external Flash memory',
      'To provide direct voltage regulation to the core clock',
      'To store peripheral register addresses during context switching',
      'To disable interrupts during critical section execution'
    ],
    correct: 0,
    explanation: 'The L1 I-Cache stores recently executed instructions, allowing the Cortex-M7 core to execute at up to 480MHz without being bottle-necked by Flash memory wait states.'
  },
  {
    topic: 'ARM Cortex-M7 Core',
    difficulty: 'Advanced',
    question: 'Which memory region in the STM32H753ZI provides zero-wait-state access at maximum core frequency?',
    options: [
      'AXI SRAM',
      'DTCM (Data Tightly Coupled Memory)',
      'Dual-Bank Quad-SPI Flash',
      'Backup SRAM in VBAT domain'
    ],
    correct: 1,
    explanation: 'DTCM (Data Tightly-Coupled Memory) is connected directly to the Cortex-M7 core D-bus, providing 0-wait-state execution even at 480 MHz.'
  },
  {
    topic: 'GPIO & Peripherals',
    difficulty: 'Beginner',
    question: 'In STM32 GPIO configuration, what happens when a pin is configured in Open-Drain mode with no pull-up?',
    options: [
      'The pin drives 3.3V HIGH and GND LOW actively',
      'The pin can drive GND LOW, but floats in high-impedance state for HIGH',
      'The pin is automatically forced into analog ADC input mode',
      'The pin outputs a continuous 100 kHz PWM signal'
    ],
    correct: 1,
    explanation: 'Open-Drain outputs can pull the line down to 0V (LOW), but require an external or internal pull-up resistor to pull the line up to 3.3V.'
  },
  {
    topic: 'FreeRTOS & Multitasking',
    difficulty: 'Intermediate',
    question: 'What is the key difference between a FreeRTOS Mutex and a Binary Semaphore?',
    options: [
      'Mutexes feature Priority Inheritance to prevent priority inversion, whereas Binary Semaphores do not',
      'Binary Semaphores can only be used inside Interrupt Service Routines (ISRs)',
      'Mutexes consume twice as much RAM memory as counting semaphores',
      'Binary semaphores automatically lock hardware DMA transfers'
    ],
    correct: 0,
    explanation: 'Mutexes implement priority inheritance, temporarily raising the priority of a low-priority task holding the mutex if a higher-priority task attempts to acquire it.'
  },
  {
    topic: 'FreeRTOS & Multitasking',
    difficulty: 'Advanced',
    question: 'Which FreeRTOS API function MUST be used when giving a semaphore from inside an STM32 interrupt handler?',
    options: [
      'xSemaphoreGive()',
      'xSemaphoreGiveFromISR()',
      'vTaskDelayFromISR()',
      'xQueueSendToBack()'
    ],
    correct: 1,
    explanation: 'FromISR API variants yield context safely without triggering invalid FreeRTOS scheduler calls within hardware interrupt context.'
  },
  {
    topic: 'Serial Communication',
    difficulty: 'Intermediate',
    question: 'In SPI full-duplex communication, how are MOSI and MISO signals synchronized?',
    options: [
      'Via start and stop bits on the serial line',
      'By a shared SCK (Serial Clock) generated exclusively by the Master',
      'By automatic CAN bus bit arbitration',
      'Through asynchronous start-of-frame telemetry'
    ],
    correct: 1,
    explanation: 'SPI is a synchronous bus where the Master generates the Serial Clock (SCK) line to shift bits in on MISO and out on MOSI simultaneously.'
  },
  {
    topic: 'Hardware Security & Cryptography',
    difficulty: 'Expert',
    question: 'How does the hardware AES accelerator on the STM32H753ZI improve security over software-based AES implementations?',
    options: [
      'It provides execution in constant clock time, mitigating side-channel timing attacks',
      'It prevents external power supply connections',
      'It bypasses the NVIC interrupt controller entirely',
      'It automatically formats output data as JSON strings'
    ],
    correct: 0,
    explanation: 'Hardware AES accelerators execute cryptographic transformations in deterministic, fixed clock cycles, protecting keys against timing analysis side-channel attacks.'
  },
  {
    topic: 'ADC & Analog Interfacing',
    difficulty: 'Intermediate',
    question: 'Why is DMA commonly paired with STM32 ADC multi-channel continuous conversions?',
    options: [
      'To transfer converted analog samples directly to SRAM without CPU intervention',
      'To increase the reference voltage from 3.3V to 5.0V',
      'To automatically invert the digital output samples',
      'To bypass the ADC sample and hold capacitor'
    ],
    correct: 0,
    explanation: 'DMA automatically offloads sample transfers from ADC data registers to RAM buffers in the background, freeing 100% of CPU time for signal processing.'
  }
];

export function QuizEngine({ onOpenReportModal, initialCourseCode }) {
  const [activePortal, setActivePortal] = useState('human'); // 'human' or 'ai'
  
  // Human Quiz State
  const [selectedLabId, setSelectedLabId] = useState(labExperiments[0].id);
  const [humanAnswers, setHumanAnswers] = useState({});
  const [humanSubmitted, setHumanSubmitted] = useState({});

  // AI Quiz Generator State
  const [aiTopic, setAiTopic] = useState('ALL');
  const [aiDifficulty, setAiDifficulty] = useState('ALL');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [currentAiQuiz, setCurrentAiQuiz] = useState([]);
  const [aiAnswers, setAiAnswers] = useState({});
  const [aiSubmitted, setAiSubmitted] = useState(false);
  const [aiScore, setAiScore] = useState(0);

  const currentLab = labExperiments.find((l) => l.id === selectedLabId) || labExperiments[0];

  // Generate AI Quiz
  const generateAiQuiz = () => {
    let pool = [...aiQuestionBank];
    if (aiTopic !== 'ALL') {
      pool = pool.filter((q) => q.topic.toLowerCase().includes(aiTopic.toLowerCase()));
    }
    if (aiDifficulty !== 'ALL') {
      pool = pool.filter((q) => q.difficulty.toLowerCase() === aiDifficulty.toLowerCase());
    }

    // Shuffle and pick
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(aiQuestionCount, shuffled.length));

    setCurrentAiQuiz(selected);
    setAiAnswers({});
    setAiSubmitted(false);
    setAiScore(0);
  };

  useEffect(() => {
    if (currentAiQuiz.length === 0) {
      generateAiQuiz();
    }
  }, []);

  // Human Quiz Handlers
  const handleSelectHumanOption = (labId, qIdx, optIdx) => {
    if (humanSubmitted[labId]) return;
    setHumanAnswers((prev) => ({ ...prev, [`${labId}_${qIdx}`]: optIdx }));
  };

  const handleSubmitHumanQuiz = (labId) => {
    setHumanSubmitted((prev) => ({ ...prev, [labId]: true }));
  };

  const handleResetHumanQuiz = (labId) => {
    setHumanSubmitted((prev) => ({ ...prev, [labId]: false }));
    const newAns = { ...humanAnswers };
    currentLab.quiz.forEach((_, qIdx) => delete newAns[`${labId}_${qIdx}`]);
    setHumanAnswers(newAns);
  };

  const getHumanLabScore = (labId) => {
    const lab = labExperiments.find((l) => l.id === labId);
    if (!lab) return 0;
    let score = 0;
    lab.quiz.forEach((q, idx) => {
      if (humanAnswers[`${labId}_${idx}`] === q.correct) score++;
    });
    return score;
  };

  // AI Quiz Handlers
  const handleSelectAiOption = (qIdx, optIdx) => {
    if (aiSubmitted) return;
    setAiAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitAiQuiz = () => {
    let score = 0;
    currentAiQuiz.forEach((q, idx) => {
      if (aiAnswers[idx] === q.correct) score++;
    });
    setAiScore(score);
    setAiSubmitted(true);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
              <Award className="w-4 h-4" /> KLU Embedded Assessment Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              Interactive Hardware Knowledge & Quiz Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select between <span className="text-emerald-400 font-bold">Faculty Human-Curated Lab Assessments</span> or launch the <span className="text-cyan-400 font-bold">Dynamic AI Random Quiz Generator</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <FileText className="w-4 h-4" /> Export Official Lab Report
            </button>
          </div>
        </div>

        {/* Portal Mode Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => setActivePortal('human')}
            className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
              activePortal === 'human'
                ? 'bg-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <ShieldCheck className={`w-8 h-8 shrink-0 ${activePortal === 'human' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <div>
              <div className="font-bold text-slate-200">Human-Curated Lab Assessments</div>
              <div className="text-[11px] text-slate-400 mt-0.5">26 Lab Manual evaluation tests authored by KLU faculty</div>
            </div>
          </button>

          <button
            onClick={() => setActivePortal('ai')}
            className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
              activePortal === 'ai'
                ? 'bg-slate-950 border-cyan-400 shadow-xl shadow-cyan-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sparkles className={`w-8 h-8 shrink-0 ${activePortal === 'ai' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <div>
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span>Dynamic AI Random Quiz</span>
                <span className="bg-cyan-500 text-slate-950 px-1.5 py-0.2 text-[9px] font-black rounded">AI</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Randomly synthesized quizzes across Cortex-M7 & FreeRTOS</div>
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PORTAL 1: HUMAN-CURATED LAB ASSESSMENTS                 */}
      {/* ======================================================== */}
      {activePortal === 'human' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {/* Lab Selection Buttons */}
          <div className="flex flex-wrap gap-2 text-xs pb-4 border-b border-slate-800">
            {labExperiments.map((lab) => {
              const isDone = humanSubmitted[lab.id];
              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`px-3 py-2 rounded-xl border font-bold transition flex items-center gap-2 ${
                    selectedLabId === lab.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : isDone
                      ? 'bg-slate-950 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>Lab {lab.number}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Current Lab Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
                HUMAN FACULTY EVALUATION • LAB #{currentLab.number}
              </span>
              <h3 className="text-lg font-black text-slate-100">{currentLab.title}</h3>
            </div>

            {humanSubmitted[currentLab.id] && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-emerald-400">
                  Score: {getHumanLabScore(currentLab.id)} / {currentLab.quiz.length}
                </span>
                <button
                  onClick={() => handleResetHumanQuiz(currentLab.id)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>
            )}
          </div>

          {/* Question Items */}
          <div className="space-y-6">
            {currentLab.quiz.map((q, qIdx) => {
              const key = `${currentLab.id}_${qIdx}`;
              const selectedOpt = humanAnswers[key];
              const isSubmitted = humanSubmitted[currentLab.id];

              return (
                <div key={qIdx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-200 flex items-start gap-2 text-sm">
                    <span className="text-emerald-400">Q{qIdx + 1}.</span> {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isCorrect = q.correct === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        else if (isChosen && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      } else if (isChosen) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectHumanOption(currentLab.id, qIdx, optIdx)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
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

                  {isSubmitted && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 text-xs mt-2">
                      <span className="text-cyan-400 font-bold block mb-1">Faculty Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!humanSubmitted[currentLab.id] && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleSubmitHumanQuiz(currentLab.id)}
                disabled={Object.keys(humanAnswers).filter((k) => k.startsWith(currentLab.id)).length < currentLab.quiz.length}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition shadow-lg"
              >
                SUBMIT & EVALUATE LAB ANSWERS
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* PORTAL 2: DYNAMIC AI RANDOM QUIZ GENERATOR              */}
      {/* ======================================================== */}
      {activePortal === 'ai' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {/* AI Generator Filter Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-cyan-400">
                <Sparkles className="w-4 h-4" /> AI QUIZ GENERATOR CONTROLS
              </div>
              <button
                onClick={generateAiQuiz}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl flex items-center gap-2 shadow-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Generate New Random Quiz
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Topic Domain</label>
                <select
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Embedded Domains</option>
                  <option value="Cortex-M7">ARM Cortex-M7 Core</option>
                  <option value="GPIO">GPIO & Peripherals</option>
                  <option value="FreeRTOS">FreeRTOS & Multitasking</option>
                  <option value="Communication">Serial Communication</option>
                  <option value="Security">Hardware Security & Crypto</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Difficulty Level</label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Number of Questions</label>
                <select
                  value={aiQuestionCount}
                  onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Quiz Header Score View */}
          {aiSubmitted && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-400 text-xl">
                  {Math.round((aiScore / currentAiQuiz.length) * 100)}%
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-100 text-sm">AI Quiz Assessment Results</h4>
                  <p className="text-xs text-slate-400">You scored {aiScore} out of {currentAiQuiz.length} correct</p>
                </div>
              </div>

              <button
                onClick={generateAiQuiz}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake / New AI Quiz
              </button>
            </div>
          )}

          {/* AI Generated Questions */}
          <div className="space-y-6">
            {currentAiQuiz.map((q, qIdx) => {
              const selectedOpt = aiAnswers[qIdx];
              return (
                <div key={qIdx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-extrabold">
                      {q.topic}
                    </span>
                    <span className="text-slate-500">{q.difficulty}</span>
                  </div>

                  <h4 className="font-bold text-slate-200 text-sm flex items-start gap-2">
                    <span className="text-cyan-400">Q{qIdx + 1}.</span> {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      const isCorrect = q.correct === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (aiSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        else if (isChosen && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      } else if (isChosen) {
                        btnStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAiOption(qIdx, optIdx)}
                          disabled={aiSubmitted}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            {opt}
                          </span>
                          {aiSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {aiSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {aiSubmitted && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 text-xs mt-2">
                      <span className="text-cyan-400 font-bold block mb-1">AI Logic Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!aiSubmitted && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSubmitAiQuiz}
                disabled={Object.keys(aiAnswers).length < currentAiQuiz.length}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition shadow-lg"
              >
                SUBMIT AI QUIZ ANSWERS
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
