'use client';

import React from 'react';
import { Users, Award, TrendingUp, Sparkles } from 'lucide-react';

interface SectionStat {
  section: string;
  count: number;
  avgCgpa: number;
  avgSgpa: number;
  topCgpa: number;
}

export default function SectionComparison({ sectionStats }: { sectionStats: SectionStat[] }) {
  if (!sectionStats || sectionStats.length === 0) return null;

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> Section Performance Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Head-to-head academic metrics across Section A, B & C</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sectionStats.map((sec) => (
          <div
            key={sec.section}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 relative overflow-hidden group hover:border-indigo-500/50 transition-all"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-display font-extrabold text-sm px-2.5 py-1 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Section {sec.section}
              </span>
              <span className="text-xs font-mono font-medium text-slate-500">
                {sec.count || 0} Students
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Mean CGPA
                </span>
                <span className="font-extrabold font-display text-emerald-600 dark:text-emerald-400 text-sm">
                  {Number(sec.avgCgpa || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Mean SGPA
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {Number(sec.avgSgpa || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Highest CGPA
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {Number(sec.topCgpa || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
