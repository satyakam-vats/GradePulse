'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

// Distinct, vibrant, modern palette for each grade band
const BAND_COLOR_MAP: Record<string, string> = {
  '9-10 (Outstanding)': '#10b981',  // Emerald
  '8-9 (Excellent)': '#3b82f6',     // Royal Blue
  '7-8 (Very Good)': '#8b5cf6',     // Purple
  '6-7 (Good)': '#f59e0b',          // Amber / Gold
  '5-6 (Average)': '#f97316',       // Coral Orange
  '<5 (Below Average)': '#ef4444'   // Bright Rose
};

const FALLBACK_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#ef4444'];

export default function GradeBandChart({ data, gradeBands }: { data?: any[], gradeBands?: any[] }) {
  const rawData = data || gradeBands || [];

  if (!rawData || rawData.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-slate-400 text-sm">
        No grade band data available
      </div>
    );
  }

  // Filter out bands with 0 count for a clean donut visual
  const activeData = rawData.filter(item => item.count > 0);
  const total = rawData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="w-full h-[400px] flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Grade Band Breakdown
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Cohort Composition</span>
      </div>

      {/* Donut Chart Container */}
      <div className="w-full flex-grow relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={activeData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="count"
              nameKey="band"
              animationDuration={700}
            >
              {activeData.map((entry, index) => {
                const color = BAND_COLOR_MAP[entry.band] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                return <Cell key={`cell-${index}`} fill={color} stroke="#0f172a" strokeWidth={2} />;
              })}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const color = BAND_COLOR_MAP[item.name as string] || '#6366f1';
                  const pct = total > 0 ? ((Number(item.value) / total) * 100).toFixed(1) : '0';
                  return (
                    <div className="p-3.5 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl text-xs space-y-1.5 backdrop-blur-md z-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <p className="font-bold text-slate-100">{item.name}</p>
                      </div>
                      <p className="text-slate-300 font-medium pl-4">
                        Students: <span className="text-white font-bold text-sm">{item.value}</span> ({pct}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={45} 
              iconType="circle"
              formatter={(value) => (
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 px-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-14">
          <span className="text-3xl font-black font-display text-slate-900 dark:text-white">{total}</span>
          <span className="text-xs text-slate-400 font-medium">Total Cohort</span>
        </div>
      </div>
    </div>
  );
}
