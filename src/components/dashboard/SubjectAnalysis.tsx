'use client';

import React, { useState, useMemo } from 'react';
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

// Multi-hue color scale based on GPA performance tier
const TIER_COLORS = [
  '#10b981', // 9.5+: Emerald
  '#06b6d4', // 9.0 - 9.49: Cyan
  '#3b82f6', // 8.5 - 8.99: Blue
  '#6366f1', // 8.0 - 8.49: Indigo
  '#8b5cf6', // 7.5 - 7.99: Purple
  '#f59e0b', // 7.0 - 7.49: Amber
  '#f97316', // 6.0 - 6.99: Orange
  '#ef4444'  // < 6.0: Red
];

export default function SubjectAnalysis({ subjectStats }: { subjectStats: any[] }) {
  const [sortBy, setSortBy] = useState<'gpa_desc' | 'gpa_asc' | 'fails' | 'cie'>('gpa_desc');

  const normalizedData = useMemo(() => {
    if (!subjectStats || subjectStats.length === 0) return [];

    return subjectStats.map(item => {
      const courseCode = item.subject?.courseCode || item.courseCode || item.Course_Code || 'COURSE';
      const name = item.subject?.name || item.name || item.Course_Name || courseCode;
      const avgGpa = Number(item.avgGpa ?? item.avgGPA ?? 0);
      const avgCie = Number(item.avgCie ?? item.avgCIE ?? 0);
      const avgAtt = Number(item.avgAttendance ?? item.attendance ?? 0);
      const failed = Number(item.failed ?? item.failCount ?? 0);
      const passed = Number(item.passed ?? item.passCount ?? 0);

      return {
        courseCode,
        name,
        avgGpa,
        avgCie,
        avgAtt,
        failed,
        passed,
        total: passed + failed
      };
    });
  }, [subjectStats]);

  const sortedData = useMemo(() => {
    let list = [...normalizedData];
    if (sortBy === 'gpa_desc') {
      list.sort((a, b) => b.avgGpa - a.avgGpa);
    } else if (sortBy === 'gpa_asc') {
      list.sort((a, b) => a.avgGpa - b.avgGpa);
    } else if (sortBy === 'fails') {
      list.sort((a, b) => b.failed - a.failed);
    } else if (sortBy === 'cie') {
      list.sort((a, b) => a.avgCie - b.avgCie);
    }
    return list;
  }, [normalizedData, sortBy]);

  if (normalizedData.length === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 text-sm">
        <BookOpen className="w-8 h-8 mb-2 text-slate-500 opacity-50" />
        No subject analysis data available for this semester
      </div>
    );
  }

  const getTierColor = (gpa: number) => {
    if (gpa >= 9.5) return '#10b981'; // Emerald
    if (gpa >= 9.0) return '#06b6d4'; // Cyan
    if (gpa >= 8.5) return '#3b82f6'; // Blue
    if (gpa >= 8.0) return '#6366f1'; // Indigo
    if (gpa >= 7.5) return '#8b5cf6'; // Purple
    if (gpa >= 7.0) return '#f59e0b'; // Amber
    if (gpa >= 6.0) return '#f97316'; // Orange
    return '#ef4444';                // Red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = getTierColor(data.avgGpa);
      return (
        <div className="p-3.5 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl text-xs space-y-1.5 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <p className="font-extrabold text-sm text-slate-100">{data.name}</p>
          </div>
          <p className="font-mono text-slate-400 pl-4">Code: <span className="text-white font-bold">{data.courseCode}</span></p>
          <div className="pt-1.5 border-t border-slate-800 space-y-1 pl-4">
            <p className="text-slate-300">Mean GPA: <span className="font-bold text-sm" style={{ color }}>{data.avgGpa.toFixed(2)}</span> / 10</p>
            <p className="text-slate-300">Mean CIE: <span className="text-indigo-400 font-bold">{data.avgCie.toFixed(1)}</span> / 50</p>
            <p className="text-slate-300">Mean Attendance: <span className="text-cyan-400 font-bold">{data.avgAtt.toFixed(1)}%</span></p>
            <p className="text-slate-300">Pass: <span className="text-emerald-400 font-bold">{data.passed}</span> | Fail: <span className="text-rose-400 font-bold">{data.failed}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Subject Performance Spectrum
          </h3>
        </div>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold py-1.5 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-sm"
        >
          <option value="gpa_desc">Sort: Highest GPA</option>
          <option value="gpa_asc">Sort: Hardest Subject (Lowest GPA)</option>
          <option value="fails">Sort: Most Fails</option>
          <option value="cie">Sort: Lowest CIE</option>
        </select>
      </div>

      {/* Horizontal Bar Chart Container */}
      <div className="w-full flex-grow pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 15, left: 65, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis type="number" domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
            <YAxis 
              type="category" 
              dataKey="courseCode" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }} 
              width={65}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }} />
            <Bar dataKey="avgGpa" radius={[0, 6, 6, 0]} barSize={16} animationDuration={700}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getTierColor(entry.avgGpa)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
