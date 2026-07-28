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
import { BarChart2 } from 'lucide-react';

export default function DistributionChart({ data, title, metric }: { data: any[], title: string, metric: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-slate-400 text-sm">
        No distribution data available
      </div>
    );
  }

  return (
    <div className="w-full h-[380px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Cohort Frequency</span>
      </div>

      <div className="w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis 
              dataKey="range" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xl text-xs font-sans">
                      <p className="font-semibold text-emerald-400 mb-1">{metric.toUpperCase()} Range: {label}</p>
                      <p className="text-slate-300 font-medium">Students: <span className="text-white font-bold">{payload[0].value}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={600} animationEasing="ease-out">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#059669'} opacity={0.9} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
