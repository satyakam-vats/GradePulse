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

export default function SubjectAnalysis({ subjectStats }: { subjectStats: any[] }) {
  const [sortBy, setSortBy] = useState<'gpa' | 'fails'>('gpa');

  if (!subjectStats || subjectStats.length === 0) return null;

  const sortedData = [...subjectStats].sort((a, b) => {
    if (sortBy === 'gpa') return (b.avgGPA || 0) - (a.avgGPA || 0);
    return (b.failCount || 0) - (a.failCount || 0);
  });

  const getDifficultyColor = (gpa: number) => {
    if (gpa >= 8.5) return '#10b981'; // Green - Easy
    if (gpa >= 7.0) return '#3b82f6'; // Blue - Normal
    if (gpa >= 5.5) return '#f59e0b'; // Amber - Hard
    return '#ef4444'; // Red - Very Hard
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
          <p className="font-bold text-slate-800 dark:text-white mb-1">{data.Course_Name || data.Course_Code}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Avg GPA: <span className="font-semibold">{data.avgGPA?.toFixed(2)}</span></p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Passes: <span className="text-emerald-500 font-semibold">{data.passCount}</span></p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Fails: <span className="text-rose-500 font-semibold">{data.failCount}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Subject Performance Analysis</h3>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-100 dark:bg-slate-700 border-none rounded-md text-sm py-1.5 px-3 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="gpa">Sort by Avg GPA</option>
          <option value="fails">Sort by Fail Count</option>
        </select>
      </div>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis type="number" domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
            <YAxis 
              type="category" 
              dataKey="Course_Code" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Bar dataKey="avgGPA" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1000}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.avgGPA || 0)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400 justify-center">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> High Performance (≥ 8.5)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Good (7.0 - 8.4)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Average (5.5 - 6.9)</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Needs Attention (&lt; 5.5)</div>
      </div>
    </div>
  );
}
