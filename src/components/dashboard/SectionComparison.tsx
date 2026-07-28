'use client';

import React, { useMemo } from 'react';
import { Users, Award, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionStat {
  section: string;
  count: number;
  avgCgpa: number;
  avgSgpa: number;
  topCgpa: number;
  topSgpa?: number;
}

export default function SectionComparison({ 
  sectionStats,
  metric = 'cgpa'
}: { 
  sectionStats: SectionStat[];
  metric?: 'cgpa' | 'sgpa';
}) {
  if (!sectionStats || sectionStats.length === 0) return null;

  const isCgpa = metric === 'cgpa';

  // Rank sections dynamically based on selected metric
  const sortedSections = useMemo(() => {
    return [...sectionStats].sort((a, b) => {
      const valA = isCgpa ? Number(a.avgCgpa || 0) : Number(a.avgSgpa || 0);
      const valB = isCgpa ? Number(b.avgCgpa || 0) : Number(b.avgSgpa || 0);
      return valB - valA;
    });
  }, [sectionStats, isCgpa]);

  return (
    <div className="w-full ui-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-display flex items-center gap-2">
            <Users className="w-4 h-4 theme-accent-text" /> Section Performance Comparison
          </h3>
          <p className="text-xs opacity-70">
            Head-to-head academic metrics across Section A, B & C ({metric.toUpperCase()} Mode)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sectionStats.map((sec) => {
          const rankIndex = sortedSections.findIndex(s => s.section === sec.section) + 1;
          const avgCgpa = Number(sec.avgCgpa || 0);
          const avgSgpa = Number(sec.avgSgpa || 0);
          const topCgpa = Number(sec.topCgpa || 0);
          const topSgpa = Number(sec.topSgpa || topCgpa);

          const primaryAvg = isCgpa ? avgCgpa : avgSgpa;
          const primaryHighest = isCgpa ? topCgpa : topSgpa;

          let themeBorder = 'border-slate-500/20';
          let themeBg = 'ui-card';
          let badgeStyle = 'bg-slate-500/10 opacity-70';
          let badgeText = `#${rankIndex}`;

          if (rankIndex === 1) {
            themeBorder = 'theme-accent-border border-2';
            themeBg = 'ui-card';
            badgeStyle = 'theme-accent-bg text-white font-bold shadow-sm';
            badgeText = '🏆 #1 Leader';
          } else if (rankIndex === 2) {
            themeBorder = 'border-slate-500/30';
            themeBg = 'ui-card';
            badgeStyle = 'theme-secondary-bg text-white font-bold';
            badgeText = '#2 Rank';
          } else if (rankIndex === 3) {
            themeBorder = 'border-slate-500/20';
            themeBg = 'ui-card';
            badgeStyle = 'bg-amber-500/20 text-amber-600 font-bold';
            badgeText = '#3 Rank';
          }

          return (
            <motion.div
              key={sec.section}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className={`p-4 rounded-xl border ${themeBorder} ${themeBg} relative overflow-hidden flex flex-col justify-between transition-all`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-sm">
                    Section {sec.section}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${badgeStyle}`}>
                    {badgeText}
                  </span>
                </div>

                <span className="text-xs font-mono font-medium opacity-70">
                  {sec.count || 0} Students
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Primary Metric Row */}
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-1.5 opacity-80">
                    <TrendingUp className="w-3.5 h-3.5 theme-accent-text" /> Mean {metric.toUpperCase()}
                  </span>
                  <span className="font-extrabold font-display theme-accent-text text-sm">
                    {primaryAvg.toFixed(2)}
                  </span>
                </div>

                {/* Secondary Metric Row */}
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-1.5 opacity-80">
                    <Sparkles className="w-3.5 h-3.5 theme-secondary-text" /> Mean {isCgpa ? 'SGPA' : 'CGPA'}
                  </span>
                  <span className="font-bold theme-secondary-text font-mono">
                    {(isCgpa ? avgSgpa : avgCgpa).toFixed(2)}
                  </span>
                </div>

                {/* Highest Metric Row */}
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-1.5 opacity-80">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Highest {metric.toUpperCase()}
                  </span>
                  <span className="font-bold font-mono">
                    {primaryHighest.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
