import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Zap, Cpu, Terminal, ShieldAlert, Activity, CheckCircle } from 'lucide-react';

/* ====================================================================
   LAB 1: GPIO & LED SIMULATOR
   ==================================================================== */
export function GpioSimulator() {
  const [speed, setSpeed] = useState(300);
  const [mode, setMode] = useState('chase'); // 'chase', 'all', 'binary'
  const [isRunning, setIsRunning] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 8);
    }, speed);
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  let ld1 = false, ld2 = false, ld3 = false;
  if (mode === 'chase') {
    if (step % 4 === 0) ld1 = true;
    else if (step % 4 === 1) ld2 = true;
    else if (step % 4 === 2) ld3 = true;
  } else if (mode === 'all') {
    const on = step % 2 === 0;
    ld1 = on; ld2 = on; ld3 = on;
  } else if (mode === 'binary') {
    ld1 = !!(step & 1);
    ld2 = !!(step & 2);
    ld3 = !!(step & 4);
  }

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-cyan-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <Zap className="w-4 h-4 text-cyan-400" /> Virtual Hardware Board Simulator (GPIO Ports)
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1 transition ${
              isRunning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRunning ? 'PAUSE' : 'RUN'}
          </button>
        </div>
      </div>

      {/* Virtual LEDs Display */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* LD1 Green */}
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
          ld1 ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className={`w-10 h-10 rounded-full mb-2 border transition-all duration-200 ${
            ld1 ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_15px_#10b981]' : 'bg-emerald-950 border-emerald-900'
          }`} />
          <span className="text-xs font-mono font-bold text-emerald-400">LD1 (Green)</span>
          <span className="text-[10px] font-mono text-slate-400">PB0 = {ld1 ? 'HIGH (1)' : 'LOW (0)'}</span>
        </div>

        {/* LD2 Blue */}
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
          ld2 ? 'bg-blue-950/60 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className={`w-10 h-10 rounded-full mb-2 border transition-all duration-200 ${
            ld2 ? 'bg-blue-400 border-blue-200 shadow-[0_0_15px_#3b82f6]' : 'bg-blue-950 border-blue-900'
          }`} />
          <span className="text-xs font-mono font-bold text-blue-400">LD2 (Blue)</span>
          <span className="text-[10px] font-mono text-slate-400">PB7 = {ld2 ? 'HIGH (1)' : 'LOW (0)'}</span>
        </div>

        {/* LD3 Red */}
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
          ld3 ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-slate-950/40 border-slate-800 opacity-60'
        }`}>
          <div className={`w-10 h-10 rounded-full mb-2 border transition-all duration-200 ${
            ld3 ? 'bg-rose-500 border-rose-200 shadow-[0_0_15px_#f43f5e]' : 'bg-rose-950 border-rose-900'
          }`} />
          <span className="text-xs font-mono font-bold text-rose-400">LD3 (Red)</span>
          <span className="text-[10px] font-mono text-slate-400">PB14 = {ld3 ? 'HIGH (1)' : 'LOW (0)'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <label className="text-slate-400 mb-1 block">Animation Pattern:</label>
          <div className="flex gap-2">
            {['chase', 'all', 'binary'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded uppercase font-semibold transition ${
                  mode === m ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-400 mb-1 block flex justify-between">
            <span>SysTick Delay Interval:</span>
            <span className="text-cyan-400 font-bold">{speed} ms</span>
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   LAB 2: BUTTON INTERRUPT & LOGIC ANALYZER SIMULATOR
   ==================================================================== */
export function ButtonInterruptSimulator() {
  const [interruptCount, setInterruptCount] = useState(0);
  const [ledState, setLedState] = useState(false);
  const [debounceEnabled, setDebounceEnabled] = useState(true);
  const [bounceLog, setBounceLog] = useState([]);
  const canvasRef = useRef(null);

  const handleButtonClick = () => {
    const now = Date.now();
    const last = bounceLog.length > 0 ? bounceLog[bounceLog.length - 1].time : 0;
    
    // Simulate mechanical bounce: 3 rapid spikes
    const triggers = debounceEnabled ? 1 : Math.floor(Math.random() * 4) + 2;
    
    if (debounceEnabled) {
      if (now - last > 50) {
        setInterruptCount((prev) => prev + 1);
        setLedState((prev) => !prev);
        setBounceLog((prev) => [...prev.slice(-15), { time: now, valid: true }]);
      }
    } else {
      setInterruptCount((prev) => prev + triggers);
      setLedState((prev) => !prev);
      setBounceLog((prev) => [...prev.slice(-15), { time: now, valid: false, count: triggers }]);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-blue-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <Activity className="w-4 h-4 text-blue-400" /> Logic Analyzer & EXTI Interrupt Trigger
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setInterruptCount(0); setBounceLog([]); }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono text-slate-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Physical Button Control */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <button
            onClick={handleButtonClick}
            className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 text-white font-mono font-bold text-xs shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95 hover:brightness-110 transition flex flex-col items-center justify-center border-4 border-slate-800"
          >
            <span className="text-sm font-extrabold">PRESS B1</span>
            <span className="text-[10px] text-blue-200">PC13 (Blue)</span>
          </button>

          <div className="mt-4 flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Software Debounce:</span>
            <button
              onClick={() => setDebounceEnabled(!debounceEnabled)}
              className={`px-3 py-1 rounded font-bold transition ${
                debounceEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {debounceEnabled ? 'ENABLED (50ms)' : 'DISABLED (Bouncy)'}
            </button>
          </div>
        </div>

        {/* Interrupt Monitor Panel */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="text-slate-400 mb-1">NVIC EXTI15_10 Interrupt Counter:</div>
            <div className="text-3xl font-black text-cyan-400 mb-2">{interruptCount} triggers</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400">LD2 Blue LED (PB7):</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                ledState ? 'bg-blue-500 text-slate-950 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-800 text-slate-400'
              }`}>
                {ledState ? 'HIGH (TOGGLED)' : 'LOW (OFF)'}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
            {bounceLog.length === 0 ? (
              <span>Press the button to generate EXTI interrupt events...</span>
            ) : (
              <div className="max-h-20 overflow-y-auto space-y-1">
                {bounceLog.slice().reverse().map((log, i) => (
                  <div key={i} className={`flex justify-between ${log.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span>Event #{bounceLog.length - i}: {log.valid ? 'Clean Edge Detected' : `Bounce Glitch (${log.count} spurious IRQs)`}</span>
                    <span>{new Date(log.time).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   LAB 3: ADC & TEMPERATURE CANVAS SIMULATOR
   ==================================================================== */
export function AdcSimulator() {
  const [volts, setVolts] = useState(1.65);
  const [temp, setTemp] = useState(36.5);
  const canvasRef = useRef(null);
  const historyRef = useRef([]);

  const rawAdc16 = Math.round((volts / 3.3) * 65535);

  useEffect(() => {
    historyRef.current.push({ volts, temp });
    if (historyRef.current.length > 60) historyRef.current.shift();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Plot Voltage Waveform (Cyan)
    if (historyRef.current.length > 1) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      historyRef.current.forEach((pt, i) => {
        const x = (i / 60) * w;
        const y = h - (pt.volts / 3.3) * (h - 20) - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [volts, temp]);

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-emerald-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-emerald-400" /> 16-Bit ADC Signal & Sensor Real-Time Plotter
        </h4>
        <span className="text-xs font-mono text-slate-400">VREF = 3.3V (16-bit)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Live Controls */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
          <div>
            <label className="text-slate-300 block mb-1 flex justify-between">
              <span>Potentiometer Voltage (PA3 / A0):</span>
              <span className="text-cyan-400 font-bold">{volts.toFixed(3)} V</span>
            </label>
            <input
              type="range"
              min="0"
              max="3.3"
              step="0.01"
              value={volts}
              onChange={(e) => setVolts(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 flex justify-between">
              <span>MCU Junction Temp (Internal):</span>
              <span className="text-amber-400 font-bold">{temp.toFixed(1)} °C</span>
            </label>
            <input
              type="range"
              min="20"
              max="90"
              step="0.5"
              value={temp}
              onChange={(e) => setTemp(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">RAW 16-BIT ADC COUNT</div>
              <div className="text-lg font-bold text-cyan-400">{rawAdc16}</div>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">LSB RESOLUTION</div>
              <div className="text-lg font-bold text-emerald-400">50.35 µV</div>
            </div>
          </div>
        </div>

        {/* Live Canvas Graph */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <canvas ref={canvasRef} width={280} height={140} className="w-full h-36 bg-slate-950 rounded border border-slate-800" />
          <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Voltage PA3</span>
            <span>Real-time DMA Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   LAB 4: PWM OSCILLOSCOPE SIMULATOR
   ==================================================================== */
export function PwmOscilloscope() {
  const [freq, setFreq] = useState(1000); // 1 kHz
  const [duty, setDuty] = useState(50); // 50%
  const canvasRef = useRef(null);

  // Timer math calculations
  const timerClockHz = 240000000; // 240 MHz
  const psc = Math.round((timerClockHz / (freq * 1000)) - 1);
  const arr = 999;
  const ccr = Math.round((duty / 100) * (arr + 1));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Oscilloscope Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // PWM Square Waveform
    ctx.strokeStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const periodWidth = 80; // pixels per period
    const highWidth = (duty / 100) * periodWidth;
    const lowY = h - 25;
    const highY = 25;

    let x = 10;
    ctx.moveTo(x, lowY);

    while (x < w) {
      ctx.lineTo(x, highY);
      ctx.lineTo(x + highWidth, highY);
      ctx.lineTo(x + highWidth, lowY);
      ctx.lineTo(x + periodWidth, lowY);
      x += periodWidth;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [freq, duty]);

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-emerald-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <Activity className="w-4 h-4 text-emerald-400" /> Virtual Oscilloscope & PWM Signal Generator
        </h4>
        <span className="text-xs font-mono text-slate-400">TIM3_CH3 (PB0)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Oscilloscope Canvas Screen */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
          <canvas ref={canvasRef} width={300} height={140} className="w-full h-36 bg-slate-950 rounded border border-slate-800 shadow-inner" />
          <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-slate-400">
            <span>CH1: 1.00V/div</span>
            <span>Time: 200 µs/div</span>
            <span className="text-emerald-400 font-bold">TRIG AUTO</span>
          </div>
        </div>

        {/* Sliders & Math Breakdown */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div>
            <label className="text-slate-300 block mb-1 flex justify-between">
              <span>PWM Frequency:</span>
              <span className="text-emerald-400 font-bold">{freq} Hz</span>
            </label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={freq}
              onChange={(e) => setFreq(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1 flex justify-between">
              <span>Duty Cycle (CCR Value):</span>
              <span className="text-cyan-400 font-bold">{duty}% (CCR = {ccr})</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={duty}
              onChange={(e) => setDuty(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">PRESCALER (PSC)</span>
              <span className="text-xs font-bold text-amber-400">{psc > 0 ? psc : 0}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block">AUTO-RELOAD (ARR)</span>
              <span className="text-xs font-bold text-cyan-400">{arr}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   LAB 5: UART TERMINAL SIMULATOR
   ==================================================================== */
export function UartTerminalSimulator() {
  const [logs, setLogs] = useState([
    "=== STM32 H753ZI USART3 ST-LINK Virtual COM Port ===",
    "Baud Rate: 115200 8N1 | Status: READY",
    "Type 'HELP' or 'LED ON' to execute commands.",
    "> "
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const cmd = inputVal.trim().toUpperCase();
    const newLogs = [...logs, `> ${inputVal}`];

    if (cmd === 'HELP') {
      newLogs.push("Available CLI Commands:");
      newLogs.push(" - LED ON     : Turn ON LD1 Green LED (PB0)");
      newLogs.push(" - LED OFF    : Turn OFF LD1 Green LED");
      newLogs.push(" - TEMP       : Read internal MCU junction temp");
      newLogs.push(" - CRYP       : Test Hardware AES-256 cipher");
      newLogs.push(" - CLEAR      : Clear terminal screen");
    } else if (cmd === 'LED ON') {
      newLogs.push("[HAL] GPIO_PIN_SET -> PB0 (LD1 GREEN) Turned ON");
    } else if (cmd === 'LED OFF') {
      newLogs.push("[HAL] GPIO_PIN_RESET -> PB0 (LD1 GREEN) Turned OFF");
    } else if (cmd === 'TEMP') {
      newLogs.push("[ADC1_DMA] Internal Temp Channel = 36.8 °C (VREF=3.3V)");
    } else if (cmd === 'CRYP') {
      newLogs.push("[CRYP_HW] AES-256-ECB Ciphertext: 8F3A29B100EE74...");
    } else if (cmd === 'CLEAR') {
      setLogs(["> "]);
      setInputVal('');
      return;
    } else {
      newLogs.push(`[ERR] Command '${cmd}' not recognized. Type 'HELP'.`);
    }

    newLogs.push("> ");
    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-5 shadow-xl text-slate-100 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-emerald-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-emerald-400" /> Interactive Serial Terminal Console (115200 8N1)
        </h4>
        <span className="text-xs text-slate-400">USART3 / ST-LINK VCP</span>
      </div>

      {/* Terminal Screen */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 h-48 overflow-y-auto mb-3 text-xs text-emerald-400 font-mono space-y-1 shadow-inner">
        {logs.map((line, idx) => (
          <div key={idx} className={line.startsWith('>') ? 'text-cyan-300 font-bold' : line.startsWith('[ERR]') ? 'text-rose-400' : ''}>
            {line}
          </div>
        ))}
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type command (e.g. LED ON, TEMP, CRYP)..."
          className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition"
        >
          TRANSMIT
        </button>
      </form>
    </div>
  );
}

/* ====================================================================
   LAB 6: CRYPTO BENCHMARK SIMULATOR
   ==================================================================== */
export function CryptoBenchmarkSimulator() {
  const [payloadKb, setPayloadKb] = useState(512); // 512 KB
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [results, setResults] = useState(null);

  const runBenchmark = () => {
    setIsBenchmarking(true);
    setResults(null);

    setTimeout(() => {
      // Calculate realistic timing (Cortex-M7 @ 480 MHz)
      const swTimeMs = ((payloadKb * 1024 * 180) / 480000000) * 1000;
      const hwTimeMs = ((payloadKb * 1024 * 3.2) / 480000000) * 1000;
      const speedup = (swTimeMs / hwTimeMs).toFixed(1);

      setResults({
        swTimeMs: swTimeMs.toFixed(2),
        hwTimeMs: hwTimeMs.toFixed(2),
        speedup
      });
      setIsBenchmarking(false);
    }, 600);
  };

  return (
    <div className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-5 shadow-xl text-slate-100 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-purple-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-purple-400" /> STM32 H753ZI HW Crypto Accelerator Benchmark
        </h4>
        <span className="text-xs text-slate-400">AES-256 & SHA-256 Engine</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Controls */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 block mb-1 flex justify-between">
              <span>Data Payload Size:</span>
              <span className="text-purple-400 font-bold">{payloadKb} KB ({payloadKb / 1024} MB)</span>
            </label>
            <input
              type="range"
              min="64"
              max="2048"
              step="64"
              value={payloadKb}
              onChange={(e) => setPayloadKb(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <button
            onClick={runBenchmark}
            disabled={isBenchmarking}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded shadow-lg transition flex items-center justify-center gap-2"
          >
            {isBenchmarking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isBenchmarking ? 'EXECUTING BENCHMARK...' : 'RUN BENCHMARK TEST'}
          </button>
        </div>

        {/* Results Graph */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
          {results ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-400 font-bold">Software AES-256:</span>
                  <span className="text-rose-400">{results.swTimeMs} ms</span>
                </div>
                <div className="w-full bg-slate-800 h-4 rounded overflow-hidden">
                  <div className="bg-rose-500 h-full w-full animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-bold">Hardware CRYP Engine:</span>
                  <span className="text-emerald-400">{results.hwTimeMs} ms</span>
                </div>
                <div className="w-full bg-slate-800 h-4 rounded overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded transition-all duration-500 shadow-[0_0_10px_#10b981]"
                    style={{ width: `${Math.max(3, (results.hwTimeMs / results.swTimeMs) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">HARDWARE SPEEDUP MULTIPLIER: </span>
                <span className="text-lg font-black text-cyan-400">{results.speedup}x FASTER</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-6">
              Click 'RUN BENCHMARK TEST' to compare Software vs Hardware Crypto speeds.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   LAB 7: FREERTOS TASK SCHEDULER SIMULATOR
   ==================================================================== */
export function RtosSchedulerSimulator() {
  const [activeTasks, setActiveTasks] = useState([
    { id: 1, name: "SensorReadTask", priority: "High (3)", state: "Running", cpu: 45, color: "bg-emerald-400" },
    { id: 2, name: "NetworkLwipTask", priority: "AboveNormal (2)", state: "Ready", cpu: 30, color: "bg-cyan-400" },
    { id: 3, name: "UiDisplayTask", priority: "Normal (1)", state: "Blocked (osDelay)", cpu: 25, color: "bg-blue-400" }
  ]);

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 shadow-xl text-slate-100 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-cyan-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-cyan-400" /> FreeRTOS Preemptive Task Execution Visualizer
        </h4>
        <span className="text-xs text-slate-400">Tick Rate: 1000 Hz</span>
      </div>

      <div className="space-y-3 mb-4">
        {activeTasks.map((t) => (
          <div key={t.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-200">{t.name}</span>
              <div className="flex gap-2 items-center">
                <span className="text-slate-400 text-[10px]">Priority: {t.priority}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  t.state.includes('Running') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}>
                  {t.state}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded overflow-hidden mt-2">
              <div className={`${t.color} h-full transition-all duration-300`} style={{ width: `${t.cpu}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================
   LAB 8: DAC ANALOG SIGNAL GENERATOR SIMULATOR
   ==================================================================== */
export function DacSignalSimulator() {
  const [waveType, setWaveType] = useState('sine'); // 'sine', 'triangle', 'sawtooth'
  const [freq, setFreq] = useState(200); // 200 Hz
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Oscilloscope Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Waveform rendering
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const points = 200;
    const periodPx = 100;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * w;
      let y = h / 2;

      if (waveType === 'sine') {
        const angle = (x / periodPx) * 2 * Math.PI;
        y = h / 2 - Math.sin(angle) * (h / 3);
      } else if (waveType === 'triangle') {
        const phase = (x % periodPx) / periodPx;
        y = phase < 0.5 ? h - phase * 2 * (h - 20) - 10 : 10 + (phase - 0.5) * 2 * (h - 20);
      } else if (waveType === 'sawtooth') {
        const phase = (x % periodPx) / periodPx;
        y = h - phase * (h - 20) - 10;
      }

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [waveType, freq]);

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 shadow-xl text-slate-100 font-mono">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <h4 className="font-mono text-cyan-400 font-semibold flex items-center gap-2 text-sm uppercase tracking-wider">
          <Activity className="w-4 h-4 text-cyan-400" /> 12-Bit DAC Analog Signal Generator (PA4 / DAC1_OUT1)
        </h4>
        <span className="text-xs text-slate-400">DMA Circular Buffer</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Waveform Screen */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col items-center">
          <canvas ref={canvasRef} width={300} height={140} className="w-full h-36 bg-slate-950 rounded border border-slate-800" />
          <div className="flex justify-between w-full mt-2 text-[10px] text-slate-400">
            <span>DAC Output Voltage: 0.0V to 3.3V</span>
            <span className="text-cyan-400 font-bold">DMA ACTIVE</span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div>
            <label className="text-slate-300 block mb-1">Signal Waveform Type:</label>
            <div className="flex gap-2">
              {['sine', 'triangle', 'sawtooth'].map((type) => (
                <button
                  key={type}
                  onClick={() => setWaveType(type)}
                  className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] transition ${
                    waveType === type ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-1 flex justify-between">
              <span>Target Frequency:</span>
              <span className="text-cyan-400 font-bold">{freq} Hz</span>
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={freq}
              onChange={(e) => setFreq(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
