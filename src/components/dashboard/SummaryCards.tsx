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
      <div className="lg:col-span-7 ui-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-emerald-500 dark:border-l-emerald-400">
        {/* Soft background ambient gradient */}
        <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Cohort Mean {metric.toUpperCase()} Average
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Key Metric
            </span>
          </div>

          <div className="flex items-baseline gap-4 my-2">
            <div className="font-display text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              {meanVal.toFixed(2)}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
              / 10.00 Max Scale
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Weighted aggregate performance across all active students in this semester.
          </p>
        </div>

        {/* Range Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-mono">
            <span className="text-rose-500 font-semibold">Min: {minVal.toFixed(2)}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Cohort Spread</span>
            <span className="text-emerald-500 font-semibold">Max: {maxVal.toFixed(2)}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500 rounded-full"
              style={{
                width: `${Math.min(100, Math.max(10, (meanVal / 10) * 100))}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid (5 cols) */}
      <div className="lg:col-span-5 grid grid-cols-2 gap-4">
        {/* Median */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-2 border-l-cyan-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Median</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {medianVal.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 mt-1">50th Percentile</div>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-2 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Pass Rate</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {passRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">Cleared Semester</div>
          </div>
        </div>

        {/* Total Students */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-2 border-l-indigo-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Enrolled</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalStudents}
            </div>
            <div className="text-xs text-slate-400 mt-1">Class Strength</div>
          </div>
        </div>

        {/* Highest Score */}
        <div className="ui-card p-5 flex flex-col justify-between border-l-2 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Highest</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-amber-600 dark:text-amber-400">
              {maxVal.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Rank 1 Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
