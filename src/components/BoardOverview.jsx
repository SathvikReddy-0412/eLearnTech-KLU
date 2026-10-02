import React from 'react';
import { boardSpecs } from '../data/pinoutData';
import { Cpu, ShieldCheck, Zap, Activity, HardDrive, Wifi, ExternalLink } from 'lucide-react';

export function BoardOverview() {
  return (
    <div className="space-y-6 font-mono">
      {/* Board Hero Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold mb-4">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> STMicroelectronics NUCLEO-H753ZI
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight mb-2">
            ARM Cortex-M7 <span className="text-cyan-400">480 MHz</span> Flagship Microcontroller
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            The ST Nucleo-144 H753ZI development board provides an affordable and flexible platform to engineer high-speed embedded systems, digital signal processing, hardware cryptography, and real-time operating systems (FreeRTOS).
          </p>

          {/* Quick Specs Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">CPU CORE</span>
              <span className="text-xs font-bold text-cyan-300">Cortex-M7 FPU</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">FLASH MEMORY</span>
              <span className="text-xs font-bold text-emerald-400">2 Megabytes</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SYSTEM SRAM</span>
              <span className="text-xs font-bold text-amber-400">1 Megabyte</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SECURITY</span>
              <span className="text-xs font-bold text-purple-400">HW AES & SHA</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ADC RESOLUTION</span>
              <span className="text-xs font-bold text-cyan-400">16-bit 3.6MSPS</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">DEBUGGER</span>
              <span className="text-xs font-bold text-rose-400">ST-LINK/V3E</span>
            </div>
          </div>
        </div>

        {/* Board Image & Pinout Diagram Display */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> NUCLEO-H753ZI Board & Pinout Diagram
            </span>
            <span className="text-slate-400 text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              MB1404C Hardware
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <img
                src="/nucleo_h753zi.jpg"
                alt="STM32 NUCLEO-H753ZI Board Hardware Photo"
                className="w-full h-48 object-contain bg-slate-950 p-1 transform group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-cyan-300 font-bold border border-slate-800">
                Board Photo
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <img
                src="/nucleo_h753zi_pinout_diagram.png"
                alt="NUCLEO-H753ZI Official Connector Pinout Diagram"
                className="w-full h-48 object-contain bg-slate-950 p-1 transform group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-300 font-bold border border-slate-800">
                Pinout Map Diagram (CN7-CN10)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Map & Architecture Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specs Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> SYSTEM ARCHITECTURE & HARDWARE SPECS
          </h3>
          <div className="space-y-2 text-xs">
            {Object.entries(boardSpecs).map(([key, val]) => (
              <div key={key} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400 uppercase text-[10px] font-bold">{key}:</span>
                <span className="text-slate-200 font-bold text-right ml-4">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Map Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" /> STM32H7 MEMORY BUS MAP
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between font-bold text-cyan-400">
                <span>ITCM RAM (64 KB)</span>
                <span>0x0000 0000</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Zero wait-state instruction execution for real-time ISR vectors</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between font-bold text-emerald-400">
                <span>FLASH Memory (2 MB Dual-Bank)</span>
                <span>0x0800 0000</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Supports read-while-write firmware updates and ECC hardware error correction</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between font-bold text-amber-400">
                <span>DTCM RAM (128 KB)</span>
                <span>0x2000 0000</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Data Tightly-Coupled Memory for stack and critical calculations</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between font-bold text-purple-400">
                <span>AXI SRAM (512 KB)</span>
                <span>0x2400 0000</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">High bandwidth system bus SRAM shared with DMA1/DMA2 controllers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
