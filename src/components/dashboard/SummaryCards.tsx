'use client';

import React from 'react';
import { Award, Users, TrendingUp, ShieldCheck, BarChart3, Activity } from 'lucide-react';

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
      <div className="lg:col-span-7 ui-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-emerald-500">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Class Mean {metric.toUpperCase()} Average
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <TrendingUp className="w-3.5 h-3.5" /> Primary Metric
            </span>
          </div>

          <div className="flex items-baseline gap-4 my-2">
            <div className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {meanVal.toFixed(2)}
            </div>
            <div className="text-slate-500 text-sm font-medium">
              out of 10.00
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Average cohort performance across all enrolled courses in this semester.
          </p>
        </div>

        {/* Range Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-mono">
            <span>Min: {minVal.toFixed(2)}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Range Score</span>
            <span>Max: {maxVal.toFixed(2)}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
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
        <div className="ui-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Median</span>
            <BarChart3 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {medianVal.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 mt-1">50th Percentile</div>
          </div>
        </div>

        {/* Pass Rate */}
        <div className="ui-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pass Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {passRate.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">Cleared Semester</div>
          </div>
        </div>

        {/* Total Students */}
        <div className="ui-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Enrolled</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              {totalStudents}
            </div>
            <div className="text-xs text-slate-400 mt-1">Class Strength</div>
          </div>
        </div>

        {/* Highest Score */}
        <div className="ui-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Highest</span>
            <Award className="w-4 h-4 text-amber-500" />
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
