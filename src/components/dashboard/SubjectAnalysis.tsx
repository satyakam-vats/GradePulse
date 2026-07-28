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
      <div className="h-[380px] flex flex-col items-center justify-center text-slate-400 text-sm">
        <BookOpen className="w-8 h-8 mb-2 text-slate-500 opacity-50" />
        No subject analysis data available for this semester
      </div>
    );
  }

  const getDifficultyColor = (gpa: number) => {
    if (gpa >= 8.5) return '#10b981'; // Emerald
    if (gpa >= 7.0) return '#3b82f6'; // Blue
    if (gpa >= 5.5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3.5 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl text-xs space-y-1.5 z-50 backdrop-blur-md">
          <p className="font-extrabold text-sm text-emerald-400">{data.name}</p>
          <p className="font-mono text-slate-400">Code: <span className="text-white font-bold">{data.courseCode}</span></p>
          <div className="pt-1.5 border-t border-slate-800 space-y-1">
            <p className="text-slate-300">Mean GPA: <span className="text-emerald-400 font-bold">{data.avgGpa.toFixed(2)}</span> / 10</p>
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
    <div className="w-full h-[420px] flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Subject Performance
          </h3>
        </div>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold py-1.5 px-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 shadow-sm"
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
            <XAxis type="number" domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis 
              type="category" 
              dataKey="courseCode" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }} 
              width={65}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }} />
            <Bar dataKey="avgGpa" radius={[0, 6, 6, 0]} barSize={16} animationDuration={600}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.avgGpa)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
