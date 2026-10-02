import React, { useState } from 'react';
import { Calculator, Cpu, Zap, Activity, CheckCircle2, Copy } from 'lucide-react';

export function Calculators() {
  const [activeTab, setActiveTab] = useState('timer');

  // Timer Calculator State
  const [timerClockMHz, setTimerClockMHz] = useState(240);
  const [targetFreqHz, setTargetFreqHz] = useState(1000);
  const [targetArr, setTargetArr] = useState(999);
  const [copiedCode, setCopiedCode] = useState(false);

  // UART Calculator State
  const [pclkMHz, setPclkMHz] = useState(120);
  const [baudRate, setBaudRate] = useState(115200);

  // ADC Calculator State
  const [vref, setVref] = useState(3.3);
  const [adcBits, setAdcBits] = useState(16);

  // Timer Math
  const timerClockHz = timerClockMHz * 1000000;
  const pscCalc = Math.round((timerClockHz / (targetFreqHz * (targetArr + 1))) - 1);
  const pscActual = pscCalc < 0 ? 0 : pscCalc;
  const actualFreqHz = timerClockHz / ((pscActual + 1) * (targetArr + 1));
  const timerError = (((actualFreqHz - targetFreqHz) / targetFreqHz) * 100).toFixed(4);

  // UART Math
  const pclkHz = pclkMHz * 1000000;
  const usartDiv = pclkHz / baudRate;
  const brrHex = Math.round(usartDiv).toString(16).toUpperCase();
  const actualBaud = pclkHz / Math.round(usartDiv);
  const uartError = (((actualBaud - baudRate) / baudRate) * 100).toFixed(3);

  // ADC Math
  const maxCounts = Math.pow(2, adcBits) - 1;
  const lsbVolts = vref / maxCounts;
  const lsbMicroVolts = (lsbVolts * 1000000).toFixed(2);

  const timerCode = `/* STM32 HAL Timer PWM Configuration */
htim3.Instance = TIM3;
htim3.Init.Prescaler = ${pscActual}; // Clock divided to ${(timerClockHz / (pscActual + 1) / 1000).toFixed(2)} kHz
htim3.Init.CounterMode = TIM_COUNTERMODE_UP;
htim3.Init.Period = ${targetArr}; // ARR for ${actualFreqHz.toFixed(1)} Hz PWM
htim3.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
HAL_TIM_PWM_Init(&htim3);`;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-xl font-black text-cyan-400 font-mono flex items-center gap-2">
              <Calculator className="w-6 h-6 text-cyan-400" /> STM32 Embedded Hardware Calculators
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Precision registers & formula solvers tailored for STM32 H753ZI Cortex-M7 architecture
            </p>
          </div>

          {/* Calculator Selector Tabs */}
          <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab('timer')}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'timer' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" /> Timer & PWM
            </button>
            <button
              onClick={() => setActiveTab('uart')}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'uart' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" /> UART Baud Rate
            </button>
            <button
              onClick={() => setActiveTab('adc')}
              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'adc' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" /> ADC Voltage
            </button>
          </div>
        </div>

        {/* TAB 1: TIMER & PWM CALCULATOR */}
        {activeTab === 'timer' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800 text-xs">
              <h3 className="text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2">INPUT PARAMETERS</h3>

              <div>
                <label className="text-slate-400 block mb-1">Timer Bus Clock (MHz):</label>
                <select
                  value={timerClockMHz}
                  onChange={(e) => setTimerClockMHz(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-cyan-300 rounded p-2 focus:outline-none"
                >
                  <option value={240}>240 MHz (APB1 Timer Clock - Standard H7)</option>
                  <option value={480}>480 MHz (CPU Core Max Clock)</option>
                  <option value={200}>200 MHz (APB2 Timer Clock)</option>
                  <option value={100}>100 MHz (Reduced Clock)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 flex justify-between">
                  <span>Target PWM Frequency (Hz):</span>
                  <span className="text-cyan-400 font-bold">{targetFreqHz} Hz</span>
                </label>
                <input
                  type="number"
                  value={targetFreqHz}
                  onChange={(e) => setTargetFreqHz(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-cyan-300 rounded p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 flex justify-between">
                  <span>Auto-Reload Register (ARR):</span>
                  <span className="text-amber-400 font-bold">{targetArr}</span>
                </label>
                <input
                  type="number"
                  value={targetArr}
                  onChange={(e) => setTargetArr(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-amber-300 rounded p-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Output & Code Generation */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">PRESCALER (PSC)</div>
                  <div className="text-2xl font-black text-cyan-400">{pscActual}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Register value to write</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">ACTUAL FREQUENCY</div>
                  <div className="text-2xl font-black text-emerald-400">{actualFreqHz.toFixed(1)} Hz</div>
                  <div className="text-[10px] text-slate-500 mt-1">Error: {timerError}%</div>
                </div>
              </div>

              {/* HAL Code Export */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-slate-400 font-bold">GENERATED STM32 HAL C CODE:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(timerCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800"
                  >
                    {copiedCode ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCode ? 'COPIED!' : 'COPY CODE'}
                  </button>
                </div>
                <pre className="text-[11px] text-cyan-300 overflow-x-auto leading-relaxed font-mono">
                  {timerCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UART BAUD RATE CALCULATOR */}
        {activeTab === 'uart' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800 text-xs">
              <h3 className="text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2">USART CLOCK CONFIG</h3>

              <div>
                <label className="text-slate-400 block mb-1">Peripheral Clock PCLK (MHz):</label>
                <select
                  value={pclkMHz}
                  onChange={(e) => setPclkMHz(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-cyan-300 rounded p-2 focus:outline-none"
                >
                  <option value={120}>120 MHz (APB1 Clock on H7)</option>
                  <option value={240}>240 MHz (APB2 Clock on H7)</option>
                  <option value={60}>60 MHz (Standard APB Clock)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Desired Baud Rate (bps):</label>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-emerald-400 font-bold rounded p-2 focus:outline-none"
                >
                  <option value={9600}>9,600 bps</option>
                  <option value={19200}>19,200 bps</option>
                  <option value={57600}>57,600 bps</option>
                  <option value={115200}>115,200 bps (ST-LINK Default)</option>
                  <option value={230400}>230,400 bps</option>
                  <option value={921600}>921,600 bps (High Speed)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">USART_BRR REGISTER (HEX)</div>
                <div className="text-3xl font-black text-cyan-400">0x{brrHex}</div>
                <div className="text-[10px] text-slate-500 mt-1">USARTDIV = {usartDiv.toFixed(4)}</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">ACHIEVED BAUD RATE</div>
                <div className="text-2xl font-black text-emerald-400">{Math.round(actualBaud)} bps</div>
                <div className="text-[10px] text-slate-500 mt-1">Baud Error: {uartError}%</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADC VOLTAGE CALCULATOR */}
        {activeTab === 'adc' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800 text-xs">
              <h3 className="text-sm font-bold text-cyan-300 border-b border-slate-800 pb-2">ADC PARAMETERS</h3>

              <div>
                <label className="text-slate-400 block mb-1">Reference Voltage VREF+ (Volts):</label>
                <input
                  type="number"
                  step="0.1"
                  value={vref}
                  onChange={(e) => setVref(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-cyan-300 rounded p-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ADC Hardware Resolution:</label>
                <select
                  value={adcBits}
                  onChange={(e) => setAdcBits(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-cyan-300 rounded p-2 focus:outline-none"
                >
                  <option value={16}>16 bits (STM32 H7 Native Max)</option>
                  <option value={14}>14 bits</option>
                  <option value={12}>12 bits (Standard STM32F4/F7)</option>
                  <option value={10}>10 bits</option>
                  <option value={8}>8 bits (High Speed Mode)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">1 LSB VOLTAGE STEP</div>
                <div className="text-3xl font-black text-cyan-400">{lsbMicroVolts} µV</div>
                <div className="text-[10px] text-slate-500 mt-1">({lsbVolts.toFixed(6)} V)</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400">TOTAL QUANTIZATION STEPS</div>
                <div className="text-2xl font-black text-emerald-400">{maxCounts.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-1">0 to {maxCounts} counts</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
