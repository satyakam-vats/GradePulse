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

const FALLBACK_COLORS = [
  'var(--color-primary)',
  'var(--color-accent)',
  '#f59e0b',
  '#f97316',
  '#ef4444',
  '#8b5cf6'
];

export default function GradeBandChart({ data, gradeBands }: { data?: any[], gradeBands?: any[] }) {
  const rawData = data || gradeBands || [];

  if (!rawData || rawData.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center opacity-70 text-sm">
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
          <PieIcon className="w-4 h-4 theme-accent-text" />
          <h3 className="text-base font-bold font-display">
            Grade Band Breakdown
          </h3>
        </div>
        <span className="text-xs opacity-70 font-mono">Cohort Composition</span>
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
                const color = FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                return <Cell key={`cell-${index}`} fill={color} stroke="var(--background)" strokeWidth={2} />;
              })}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const color = 'var(--color-primary)';
                  const pct = total > 0 ? ((Number(item.value) / total) * 100).toFixed(1) : '0';
                  return (
                    <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-700 shadow-2xl text-xs space-y-1.5 backdrop-blur-md z-50">
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
                <span className="text-[11px] font-semibold opacity-80 px-1">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-14">
          <span className="text-3xl font-black font-display">{total}</span>
          <span className="text-xs opacity-70 font-medium">Total Cohort</span>
        </div>
      </div>
    </div>
  );
}
