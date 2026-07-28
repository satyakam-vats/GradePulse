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

const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#0284c7', '#6366f1', '#f59e0b', '#ef4444'];

export default function GradeBandChart({ data, gradeBands }: { data?: any[], gradeBands?: any[] }) {
  const chartData = data || gradeBands || [];

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-slate-400 text-sm">
        No grade band data available
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="w-full h-[380px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Grade Band Breakdown
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Cohort Spread</span>
      </div>

      <div className="w-full flex-grow relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="count"
              nameKey="band"
              animationDuration={600}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const pct = total > 0 ? ((Number(item.value) / total) * 100).toFixed(1) : '0';
                  return (
                    <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xl text-xs font-sans">
                      <p className="font-semibold text-emerald-400 mb-1">Grade Band: {item.name}</p>
                      <p className="text-slate-300">Students: <span className="text-white font-bold">{item.value}</span> ({pct}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
          <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">{total}</span>
          <span className="text-xs text-slate-400 font-medium">Students</span>
        </div>
      </div>
    </div>
  );
}
