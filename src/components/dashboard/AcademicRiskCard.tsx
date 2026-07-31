'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, TrendingDown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AcademicRiskCardProps {
  students: any[];
  onFilterAtRisk?: () => void;
  isFilterActive?: boolean;
}

export default function AcademicRiskCard({
  students,
  onFilterAtRisk,
  isFilterActive = false
}: AcademicRiskCardProps) {
  if (!students || students.length === 0) return null;

  // Compute At-Risk student metrics
  const lowAttendanceCount = students.filter(s => Number(s.attendance || s.totalAttendance || 90) < 85).length;
  const activeBacklogCount = students.filter(s => Number(s.activeBacklogs || 0) > 0).length;
  const sgpaDropCount = students.filter(s => Number(s.sgpaDrop || 0) > 1.0).length;

  const totalAtRisk = students.filter(s => 
    Number(s.attendance || s.totalAttendance || 90) < 85 ||
    Number(s.activeBacklogs || 0) > 0 ||
    Number(s.sgpaDrop || 0) > 1.0
  ).length;

  const percentageAtRisk = Number(((totalAtRisk / students.length) * 100).toFixed(1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full ui-card p-5 space-y-4 border-l-4 border-l-rose-500 shadow-md relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold border border-rose-500/30 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display flex items-center gap-2">
              Academic Support & Risk Radar
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-[10px] font-mono font-black border border-rose-500/30">
                {totalAtRisk} Students ({percentageAtRisk}%)
              </span>
            </h3>
            <p className="text-xs opacity-70 font-medium">
              Early warning indicator for attendance shortage (&lt;85%), active backlogs, or SGPA drop
            </p>
          </div>
        </div>

        {onFilterAtRisk && (
          <button
            onClick={onFilterAtRisk}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap ${
              isFilterActive
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            {isFilterActive ? '✓ Showing At-Risk Cohort' : 'Filter At-Risk Students'}
          </button>
        )}
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-xl border border-slate-500/20 bg-slate-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-80">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Attendance &lt; 85%</span>
          </div>
          <span className="font-mono font-black text-sm text-amber-500">{lowAttendanceCount}</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-500/20 bg-slate-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-80">
            <RefreshCw className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Active Backlogs</span>
          </div>
          <span className="font-mono font-black text-sm text-rose-500">{activeBacklogCount}</span>
        </div>

        <div className="p-3 rounded-xl border border-slate-500/20 bg-slate-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-80">
            <TrendingDown className="w-4 h-4 text-orange-500 shrink-0" />
            <span>SGPA Drop &gt; 1.0</span>
          </div>
          <span className="font-mono font-black text-sm text-orange-500">{sgpaDropCount}</span>
        </div>
      </div>
    </motion.div>
  );
}
