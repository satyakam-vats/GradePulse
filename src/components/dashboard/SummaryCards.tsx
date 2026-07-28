'use client';

import React from 'react';
import { Award, Users, Activity, Sparkles, BarChart3, BookOpen } from 'lucide-react';

export default function SummaryCards({ stats, metric }: { stats: any, metric: 'sgpa' | 'cgpa' }) {
  if (!stats) return null;

  const currentStats = stats[metric]?.stats || stats[metric] || {};
  const meanVal = currentStats.mean || 0;
  const medianVal = currentStats.median || 0;
  const minVal = currentStats.min || 0;
  const maxVal = currentStats.max || 0;
  const totalStudents = stats.totalStudents || 200;
  const subjectCount = stats.subjectStats?.length || 10;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
      {/* Dominant Hero Stat Card (7 cols) */}
      <div className="lg:col-span-7 ui-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between border border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-indigo-500/10 shadow-lg shadow-emerald-500/5">
        {/* Glowing Ambient Mesh Orbs */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/25 dark:bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/20 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-300 font-mono block">
                  Cohort Mean {metric.toUpperCase()}
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Primary Class Benchmark</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-200 border border-emerald-500/40 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-300 animate-pulse" /> Class Performance
            </span>
          </div>

          <div className="flex items-baseline gap-4 my-4">
            <div className="font-display text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              {meanVal.toFixed(2)}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-sm font-extrabold uppercase font-mono tracking-wider">
              / 10.00 Scale
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
            Calculated across all {totalStudents} registered CS students in Semester {stats.semesterNumber || ''}.
          </p>
        </div>

        {/* Range Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 relative z-10">
          <div className="flex justify-between items-center text-xs mb-2 font-mono">
            <span className="text-rose-500 dark:text-rose-400 font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Min: {minVal.toFixed(2)}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-[10px]">Distribution Spectrum</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" /> Max: {maxVal.toFixed(2)}
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-200/80 dark:bg-slate-900 rounded-full overflow-hidden relative p-0.5 border border-slate-300/60 dark:border-slate-800 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, Math.max(10, (meanVal / 10) * 100))}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid (5 cols) */}
      <div className="lg:col-span-5 grid grid-cols-2 gap-4">
        {/* Median Card - Cyan */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-cyan-400 bg-gradient-to-br from-cyan-500/15 via-cyan-500/5 to-transparent relative overflow-hidden group hover:border-cyan-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest font-mono text-cyan-600 dark:text-cyan-300">Median</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/30">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-300 dark:to-blue-400 bg-clip-text text-transparent">
              {medianVal.toFixed(2)}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">50th Percentile</div>
          </div>
        </div>

        {/* Active Subjects Card - Emerald */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-emerald-400 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest font-mono text-emerald-600 dark:text-emerald-300">Subjects</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent">
              {subjectCount}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Curriculum Courses</div>
          </div>
        </div>

        {/* Total Students Card - Indigo/Violet */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-indigo-400 bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent relative overflow-hidden group hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest font-mono text-indigo-600 dark:text-indigo-300">Enrolled</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-300 dark:to-violet-300 bg-clip-text text-transparent">
              {totalStudents}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Class Strength</div>
          </div>
        </div>

        {/* Highest Score Card - Amber/Gold */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-black uppercase tracking-widest font-mono text-amber-600 dark:text-amber-300">Highest</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-400 dark:from-amber-300 dark:to-orange-300 bg-clip-text text-transparent">
              {maxVal.toFixed(2)}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Rank 1 Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
