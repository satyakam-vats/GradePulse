'use client';

import React from 'react';
import { Award, Users, TrendingUp, ShieldCheck, BarChart3, Activity, Sparkles } from 'lucide-react';

export default function SummaryCards({ stats, metric }: { stats: any, metric: 'sgpa' | 'cgpa' }) {
  if (!stats) return null;

  const currentStats = stats[metric] || {};
  const meanVal = currentStats.mean || 0;
  const medianVal = currentStats.median || 0;
  const minVal = currentStats.min || 0;
  const maxVal = currentStats.max || 0;
  const passRate = stats.passPercentage || 100;
  const totalStudents = stats.totalStudents || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
      {/* Dominant Hero Stat Card (7 cols) */}
      <div className="lg:col-span-7 ui-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/15 dark:via-teal-500/10 dark:to-transparent">
        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-emerald-500/20 dark:bg-emerald-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-mono block">
                  Cohort Mean {metric.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Class Average Benchmark</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Primary Metric
            </span>
          </div>

          <div className="flex items-baseline gap-4 my-3">
            <div className="font-display text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white">
              {meanVal.toFixed(2)}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
              / 10.00 Scale
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Overall class average across all enrolled subjects in Semester {stats.semesterNumber || ''}.
          </p>
        </div>

        {/* Range Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-500/20 relative z-10">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="text-rose-600 dark:text-rose-400 font-bold">Min: {minVal.toFixed(2)}</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px]">Grade Range</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Max: {maxVal.toFixed(2)}</span>
          </div>
          <div className="w-full h-3 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden relative p-0.5 border border-slate-300/50 dark:border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 via-teal-500 to-emerald-500 rounded-full shadow-sm"
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
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-700 dark:text-cyan-300">Median</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500 text-white flex items-center justify-center shadow-sm shadow-cyan-500/30">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black text-slate-900 dark:text-white">
              {medianVal.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">50th Percentile</div>
          </div>
        </div>

        {/* Pass Rate Card - Emerald */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-700 dark:text-emerald-300">Pass Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {passRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Cleared Semester</div>
          </div>
        </div>

        {/* Total Students Card - Indigo */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-indigo-700 dark:text-indigo-300">Enrolled</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-sm shadow-indigo-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {totalStudents}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Class Strength</div>
          </div>
        </div>

        {/* Highest Score Card - Amber */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-amber-700 dark:text-amber-300">Highest</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-black text-amber-600 dark:text-amber-400">
              {maxVal.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Rank 1 Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
