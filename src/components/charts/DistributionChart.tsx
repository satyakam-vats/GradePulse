'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart2, Info } from 'lucide-react';

const BAR_COLORS = [
  '#ef4444', // Red for < 5.0
  '#f59e0b', // Amber for 5.0 - 5.9
  '#06b6d4', // Cyan for 6.0 - 6.9
  '#10b981', // Emerald for 7.0 - 7.9
  '#3b82f6', // Blue for 8.0 - 8.9
  '#8b5cf6', // Violet for 9.0 - 10.0
  '#ec4899'  // Pink
];

export default function DistributionChart({ data, title, metric }: { data: any[], title: string, metric: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-slate-400 text-sm font-medium">
        No distribution data available
      </div>
    );
  }

  const isCgpa = metric.toLowerCase() === 'cgpa';

  return (
    <div className="w-full h-[400px] flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 font-bold">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              {title}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Score Range Frequency Spectrum</span>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full font-mono border border-indigo-500/20 uppercase">
          {metric.toUpperCase()} Spread
        </span>
      </div>

      {/* Dynamic Hint Callout */}
      <div className="mb-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        {isCgpa ? (
          <span>
            <strong className="text-slate-900 dark:text-white font-mono">Cohort Min CGPA is 6.10</strong>. No students fall below 6.0 in CGPA. Switch to <strong className="text-indigo-500">SGPA mode</strong> to see 17 students with SGPAs below 5.0 due to backlogs.
          </span>
        ) : (
          <span>
            <strong className="text-rose-500">17 Students have SGPA &lt; 5.0</strong> due to active backlog subjects in this semester.
          </span>
        )}
      </div>

      {/* Bar Chart Container */}
      <div className="w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis 
              dataKey="range" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = Number(payload[0].value);
                  return (
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs space-y-1 z-50">
                      <p className="font-bold text-indigo-400">{metric.toUpperCase()} Range: {label}</p>
                      <p className="text-slate-300 font-medium">
                        Students: <span className="text-white font-bold text-sm">{val}</span>
                      </p>
                      {val === 0 && (
                        <p className="text-[10px] text-amber-400 italic pt-1 border-t border-slate-800">
                          {isCgpa ? 'No student in cohort has CGPA in this range (Min is 6.10)' : 'No student in this SGPA range'}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={600} animationEasing="ease-out">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
