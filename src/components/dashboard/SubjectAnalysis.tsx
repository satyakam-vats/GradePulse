'use client';

import React, { useState } from 'react';
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
import { BookOpen } from 'lucide-react';

export default function SubjectAnalysis({ subjectStats }: { subjectStats: any[] }) {
  const [sortBy, setSortBy] = useState<'gpa' | 'fails'>('gpa');

  if (!subjectStats || subjectStats.length === 0) {
    return (
      <div className="h-[340px] flex items-center justify-center text-slate-400 text-sm">
        No subject analysis data available
      </div>
    );
  }

  const sortedData = [...subjectStats].sort((a, b) => {
    if (sortBy === 'gpa') return (b.avgGPA || 0) - (a.avgGPA || 0);
    return (b.failCount || 0) - (a.failCount || 0);
  });

  const getDifficultyColor = (gpa: number) => {
    if (gpa >= 8.5) return '#10b981'; // Emerald
    if (gpa >= 7.0) return '#06b6d4'; // Cyan
    if (gpa >= 5.5) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xl text-xs font-sans">
          <p className="font-semibold text-emerald-400 mb-1">{data.Course_Name || data.Course_Code}</p>
          <p className="text-slate-300">Course Code: <span className="text-white font-mono">{data.Course_Code}</span></p>
          <p className="text-slate-300">Avg GPA: <span className="text-white font-bold">{data.avgGPA?.toFixed(2)}</span></p>
          <p className="text-slate-300">Pass: <span className="text-emerald-400">{data.passCount}</span> | Fail: <span className="text-rose-400">{data.failCount}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[380px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Subject Performance
          </h3>
        </div>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs py-1 px-2.5 text-slate-800 dark:text-slate-200 outline-none"
        >
          <option value="gpa">Sort: Highest GPA</option>
          <option value="fails">Sort: Most Fails</option>
        </select>
      </div>

      <div className="w-full flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 20, left: 70, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis type="number" domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis 
              type="category" 
              dataKey="Course_Code" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }} />
            <Bar dataKey="avgGPA" radius={[0, 4, 4, 0]} barSize={16} animationDuration={600}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.avgGPA || 0)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
