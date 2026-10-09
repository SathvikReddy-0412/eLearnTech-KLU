import React, { useState } from 'react';
import { coursesData } from '../data/coursesData';
import { GraduationCap, BookOpen, UserCheck, Award, FileText, ChevronRight, CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles, Search } from 'lucide-react';

export function Courses({ onSelectLab, onLaunchQuiz }) {
  const [selectedCourseId, setSelectedCourseId] = useState(coursesData[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const course = coursesData.find((c) => c.id === selectedCourseId) || coursesData[0];

  const filteredCourses = coursesData.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-mono">
      {/* Page Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <GraduationCap className="w-4 h-4" /> Official Curriculum
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Embedded Systems & Microcontroller Courses
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium max-w-3xl">
            Human-curated syllabus authored by faculty mentor <span className="text-cyan-400 font-bold">Dr. Aswinkumer S V</span> and contributors <span className="text-slate-200 font-bold">Sathvik, Harshitha, and Deepthi</span>, integrated with interactive AI learning engines.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Human Verified Syllabus</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Dynamic Quizzes</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>26 Lab Manual Correlations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Selector List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code or title..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="space-y-3">
            {filteredCourses.map((c) => {
              const isSelected = c.id === selectedCourseId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-500 to-emerald-500" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
                        }`}>
                          {c.code}
                        </span>
                        <span className="text-[10px] text-slate-500">{c.credits}</span>
                      </div>
                      <h3 className={`text-sm font-bold mt-2 leading-snug transition ${
                        isSelected ? 'text-cyan-400' : 'text-slate-200 group-hover:text-slate-100'
                      }`}>
                        {c.title}
                      </h3>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 border ${
                      c.badge.includes('Human')
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {c.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{c.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> {c.mentor}
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-1 transition">
                      View Syllabus <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Course Detailed View */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Header info */}
            <div className="pb-5 border-b border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-cyan-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-black">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{course.department}</span>
                </div>
                <span className="text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {course.credits}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-100">{course.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{course.description}</p>
            </div>

            {/* Faculty & Contributors */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Course Mentor</span>
                <div className="font-bold text-cyan-400 mt-1 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-400" /> {course.mentor}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Course Contributors</span>
                <div className="font-medium text-slate-300 mt-1">
                  {course.contributors.join(', ')}
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" /> Course Learning Outcomes
              </h3>
              <div className="grid gap-2 text-xs">
                {course.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules Syllabus */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Module Syllabus Structure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {course.modules.map((mod, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {mod.number}
                      </span>
                    </div>
                    <div className="font-bold text-slate-200">{mod.name}</div>
                    <ul className="space-y-1 text-[11px] text-slate-400 pt-1">
                      {mod.topics.map((t, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Launch Lab & AI Quiz */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onSelectLab(course.relatedLabIds[0])}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Associated Lab Experiments ({course.relatedLabIds.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLaunchQuiz(course.code)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-purple-900/40 hover:text-purple-300 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Practice AI Quiz for {course.code}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
