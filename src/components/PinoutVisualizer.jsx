import React, { useState } from 'react';
import { nucleoPinout } from '../data/pinoutData';
import { Search, Filter, Cpu, Zap, Image as ImageIcon, Grid, Maximize2, Layers } from 'lucide-react';

export function PinoutVisualizer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedConnector, setSelectedConnector] = useState('ALL');
  const [selectedPin, setSelectedPin] = useState(nucleoPinout[0]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'diagram' | 'photo'

  const categories = ['ALL', 'GPIO', 'ADC', 'DAC', 'PWM', 'SPI', 'I2C', 'UART', 'POWER', 'LED', 'BUTTON'];
  const connectors = ['ALL', 'CN7', 'CN8', 'CN9', 'CN10', 'ST-LINK VCP', 'On-Board'];

  const filteredPins = nucleoPinout.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesConnector = selectedConnector === 'ALL' || p.connector.includes(selectedConnector);
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.alt.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesConnector && matchesSearch;
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'ADC': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'DAC': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'PWM': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'SPI': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'I2C': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'UART': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'LED': return 'bg-pink-500/20 text-pink-400 border-pink-500/40';
      case 'BUTTON': return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'POWER': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                ST NUCLEO-144 MB1404C
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400" /> STM32 H753ZI Hardware Pinout & Signal Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connectors CN7, CN8, CN9 & CN10 multiplexing, alternate functions, and Arduino Zio mappings
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
              Pin Search Grid
            </button>
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                viewMode === 'diagram'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Official Pin Map
            </button>
            <button
              onClick={() => setViewMode('photo')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                viewMode === 'photo'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Board Photo
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Only for Grid mode) */}
        {viewMode === 'grid' && (
          <div className="space-y-3 pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full text-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search pin (e.g. PA3, SPI1, TIM3, CN7, D15)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Connector Filter */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                <span className="text-slate-500 text-[10px] font-bold uppercase mr-1">Header:</span>
                {connectors.map((conn) => (
                  <button
                    key={conn}
                    onClick={() => setSelectedConnector(conn)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold whitespace-nowrap transition ${
                      selectedConnector === conn
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {conn}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="text-slate-500 text-[10px] font-bold uppercase py-1 mr-1">Signal:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition uppercase text-[10px] ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODE 1: Interactive Pin Search Grid --- */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pin List Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredPins.map((pin) => (
              <div
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedPin?.id === pin.id
                    ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-slate-100">{pin.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getCategoryColor(pin.category)}`}>
                    {pin.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mb-2 leading-relaxed">{pin.description}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-2">
                  <span className="font-bold text-slate-300">{pin.connector}</span>
                  <span className="text-cyan-400 font-bold">{pin.alt.length} Alt Functions</span>
                </div>
              </div>
            ))}
            {filteredPins.length === 0 && (
              <div className="col-span-2 bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-slate-400 text-xs">
                No matching pins found for search term "{searchTerm}".
              </div>
            )}
          </div>

          {/* Selected Pin Details Inspector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">PIN INSPECTOR</span>
                  <h3 className="text-base font-black text-slate-100">{selectedPin.name}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded border font-bold text-xs ${getCategoryColor(selectedPin.category)}`}>
                  {selectedPin.category}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">CONNECTOR LOCATION</span>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-cyan-300 font-bold">
                    {selectedPin.connector}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">DESCRIPTION & HARDWARE PURPOSE</span>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300">
                    {selectedPin.description}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">ALTERNATE FUNCTIONS (AF0 - AF15 MULTIPLEX)</span>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedPin.alt.map((af, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-cyan-400">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{af}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[10px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>Operating Voltage:</span>
                    <span className="text-emerald-400 font-bold">3.3V (5V Tolerant)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Current Output:</span>
                    <span className="text-cyan-400 font-bold">20 mA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Resistors:</span>
                    <span className="text-slate-300">Software Pull-Up / Pull-Down</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 text-[10px] text-slate-500 text-center">
              Select any pin from left grid to inspect hardware configuration
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: Official Pinout Diagram View --- */}
      {viewMode === 'diagram' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-black text-cyan-400 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" /> NUCLEO-H723ZG / H743ZI2 / H753ZI Official Pinout Schematic
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete CN7, CN8, CN9, CN10 pin-by-pin layout, power rails, USB OTG and Ethernet positions
              </p>
            </div>
            <a
              href="/nucleo_h753zi_pinout_diagram.png"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Full Resolution Image
            </a>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center items-center overflow-auto max-h-[700px]">
            <img
              src="/nucleo_h753zi_pinout_diagram.png"
              alt="STM32 NUCLEO-H753ZI Full Pinout Diagram Map"
              className="w-auto max-w-full h-auto max-h-[650px] object-contain rounded shadow-2xl"
            />
          </div>

          {/* Key Header Pin Quick Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">CN7 (Top Right)</span>
              <span className="text-[11px] text-slate-400">D8-D25, I2C1 (SCL/SDA), SPI1, SPI2, AVDD, VREFP, DAC1</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">CN8 (Top Left)</span>
              <span className="text-[11px] text-slate-400">Power Rails (+5V, 3V3, IOREF, VIN), Reset, SDMMC1 D43-D50</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">CN9 (Bottom Left)</span>
              <span className="text-[11px] text-slate-400">Analog Inputs A0-A5, USART2, SAI Audio, FDCAN1, D51-D72</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1">CN10 (Bottom Right)</span>
              <span className="text-[11px] text-slate-400">Arduino D0-D7, Analog A6-A8, TIM1 PWM, QuadSPI, D26-D42</span>
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 3: Board Hardware Photo View --- */}
      {viewMode === 'photo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-black text-cyan-400 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> STM32 NUCLEO-H753ZI High-Resolution Photo
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                On-board ST-LINK/V3E programmer, ES32H753ZIT6 MCU, Ethernet RJ45, USB Micro-AB/Type-C
              </p>
            </div>
            <a
              href="/nucleo_h753zi.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" /> View Photo Original
            </a>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center items-center overflow-auto max-h-[700px]">
            <img
              src="/nucleo_h753zi.jpg"
              alt="STM32 NUCLEO-H753ZI Development Board Photo"
              className="w-auto max-w-full h-auto max-h-[650px] object-contain rounded shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
