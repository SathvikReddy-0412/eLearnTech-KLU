import React, { useState, useEffect } from 'react';
import { labExperiments } from '../data/labData';
import { LabSimulators } from './Simulators/LabSimulators';
import {
  BookOpen,
  Settings,
  Code,
  Copy,
  CheckCircle2,
  ChevronRight,
  Clock,
  Award,
  Video,
  FileText,
  Image as ImageIcon,
  Download,
  ExternalLink,
  FileCode,
  HardDrive,
  Play,
  X,
  Search,
  SlidersHorizontal,
  Sparkles,
  Layers,
  LayoutGrid,
  Filter
} from 'lucide-react';

export function LabViewer({ initialLabId }) {
  const [selectedLabId, setSelectedLabId] = useState(initialLabId || labExperiments[0].id);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'cube', 'code', 'media'
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Sidebar Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [completedLabs, setCompletedLabs] = useState(() => {
    try {
      const saved = localStorage.getItem('elearn_completed_labs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (initialLabId) {
      setSelectedLabId(initialLabId);
    }
  }, [initialLabId]);

  const toggleLabCompletion = (id) => {
    const next = completedLabs.includes(id)
      ? completedLabs.filter((labId) => labId !== id)
      : [...completedLabs, id];
    setCompletedLabs(next);
    localStorage.setItem('elearn_completed_labs', JSON.stringify(next));
  };

  const lab = labExperiments.find((l) => l.id === selectedLabId) || labExperiments[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lab.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const videos = lab.files?.filter((f) => f.type === 'video') || [];
  const youtubeFiles = lab.files?.filter((f) => f.type === 'youtube') || [];
  const images = lab.files?.filter((f) => f.type === 'image') || [];
  const documents = lab.files?.filter((f) => f.type === 'document') || [];

  // Filter experiments for sidebar
  const categories = ['ALL', 'GPIO', 'Timers', 'ADC/DAC', 'Serial', 'RTOS', 'Security'];

  const filteredExperiments = labExperiments.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `exp ${l.number}`.includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'GPIO' && l.title.toLowerCase().includes('gpio')) ||
      (selectedCategory === 'Timers' && l.title.toLowerCase().includes('timer')) ||
      (selectedCategory === 'ADC/DAC' && (l.title.toLowerCase().includes('adc') || l.title.toLowerCase().includes('dac'))) ||
      (selectedCategory === 'Serial' && (l.title.toLowerCase().includes('uart') || l.title.toLowerCase().includes('spi') || l.title.toLowerCase().includes('i2c') || l.title.toLowerCase().includes('can'))) ||
      (selectedCategory === 'RTOS' && l.title.toLowerCase().includes('freertos')) ||
      (selectedCategory === 'Security' && (l.title.toLowerCase().includes('crypto') || l.title.toLowerCase().includes('aes') || l.title.toLowerCase().includes('hash') || l.title.toLowerCase().includes('trng')));

    const matchesDifficulty =
      selectedDifficulty === 'ALL' || l.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const completionPercentage = Math.round((completedLabs.length / labExperiments.length) * 100);

  return (
    <div className="space-y-6 font-mono">
      {/* Main Grid: Left Side Dashboard / Sidebar + Right Main Lab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT SIDE DASHBOARD / SIDEBAR NAVIGATION                 */}
        {/* ======================================================== */}
        <aside className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md space-y-5 lg:sticky lg:top-24">
          
          {/* Dashboard Header & Progress */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-cyan-400" />
                <h3 className="font-black text-slate-100 text-sm tracking-wide">EXPERIMENT DASHBOARD</h3>
              </div>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-extrabold">
                {labExperiments.length} LABS
              </span>
            </div>

            {/* Student Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Lab Completion Progress</span>
                <span className="text-emerald-400 font-bold">{completionPercentage}% ({completedLabs.length}/{labExperiments.length})</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-400 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments by name or #..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category Filters</span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Experiment Sidebar List */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredExperiments.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No experiments match your search filter.
              </div>
            ) : (
              filteredExperiments.map((l) => {
                const isSelected = selectedLabId === l.id;
                const isCompleted = completedLabs.includes(l.id);
                const fileCount = l.files?.length || 0;

                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      setSelectedLabId(l.id);
                      setActiveTab('theory');
                      setSelectedImage(null);
                      setSelectedVideo(null);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 relative group ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    {/* Left Checkbox & Number */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLabCompletion(l.id);
                        }}
                        title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-700 hover:border-cyan-400 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <span className={`text-[10px] font-mono font-bold ${
                        isSelected ? 'text-cyan-400' : 'text-slate-500'
                      }`}>
                        #{l.number}
                      </span>
                    </div>

                    {/* Title & Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold truncate transition ${
                        isSelected ? 'text-cyan-300' : 'text-slate-200 group-hover:text-cyan-400'
                      }`}>
                        {l.title}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span className={`px-1.5 py-0.2 rounded ${
                          l.difficulty === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : l.difficulty === 'Intermediate'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {l.difficulty}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {l.estimatedTime}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                    }`} />
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT MAIN LAB EXPERIMENT VIEW                            */}
        {/* ======================================================== */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
            
            {/* Lab Title Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-cyan-400 font-bold mb-1">
                  <span className="bg-cyan-500 text-slate-950 px-2 py-0.5 rounded font-black">
                    EXPERIMENT #{lab.number}
                  </span>
                  <span>•</span>
                  <span className="text-amber-400">{lab.difficulty}</span>
                  <span>•</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {lab.estimatedTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100">{lab.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{lab.subtitle}</p>
              </div>

              {/* View Tabs */}
              <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
                <button
                  onClick={() => setActiveTab('theory')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'theory'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Theory & Pins
                </button>
                <button
                  onClick={() => setActiveTab('cube')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'cube'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" /> CubeMX Setup
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'code'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> Code & C-Snippet
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'media'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Simulation & Media
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: THEORY & PIN CONNECTIONS */}
            {activeTab === 'theory' && (
              <div className="pt-6 space-y-6 text-xs text-slate-300">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" /> LABORATORY OBJECTIVE & OVERVIEW
                  </h3>
                  <p className="leading-relaxed text-slate-300">{lab.objective}</p>
                  <p className="leading-relaxed text-slate-400">{lab.theoryOverview}</p>
                </div>

                {/* Circuit Connections */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" /> HARDWARE PIN CONNECTION SCHEMATIC
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lab.pinConnections?.map((pin, idx) => (
                      <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-200">{pin.signal}</span>
                          <p className="text-[11px] text-slate-400">{pin.function}</p>
                        </div>
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-bold text-[10px]">
                          {pin.pin}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" /> EXPECTED HARDWARE VERIFICATION OUTCOME
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{lab.expectedOutcome}</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: CUBEMX CONFIGURATION */}
            {activeTab === 'cube' && (
              <div className="pt-6 space-y-6 text-xs text-slate-300">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                    <Settings className="w-4 h-4 text-cyan-400" /> STM32CubeMX CLOCK & PERIPHERAL INITIALIZATION STEPS
                  </h3>
                  <div className="space-y-3">
                    {lab.cubeSetupSteps?.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-200">{step.title}</h4>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: C-CODE SNIPPET */}
            {activeTab === 'code' && (
              <div className="pt-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <FileCode className="w-4 h-4" />
                    <span>main.c — HAL Firmware Source Snippet</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition text-[11px]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="bg-[#030712] p-5 rounded-2xl border border-slate-800 overflow-x-auto text-[11px] text-emerald-400 font-mono leading-relaxed">
                  <pre>{lab.codeSnippet}</pre>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: SIMULATION & MEDIA */}
            {activeTab === 'media' && (
              <div className="pt-6 space-y-6">
                {/* Interactive Hardware Simulator */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                      <Play className="w-4 h-4 text-cyan-400" /> INTERACTIVE HARDWARE SIMULATION
                    </h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      LIVE HARDWARE LOGIC
                    </span>
                  </div>
                  <LabSimulators experimentId={lab.id} />
                </div>

                {/* Media & Resources Gallery */}
                {images.length > 0 && (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" /> CIRCUIT DIAGRAMS & SCHEMATICS
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedImage(img.path)}
                          className="group cursor-pointer relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 aspect-video"
                        >
                          <img src={img.path} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold text-cyan-300">
                            Expand Image
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
