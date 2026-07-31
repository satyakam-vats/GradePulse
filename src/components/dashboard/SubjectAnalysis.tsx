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
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

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
      const total = passed + failed || 1;
      const passRate = Number(((passed / total) * 100).toFixed(1));

      // Difficulty Tier
      let tier = 'High Pass';
      let tierColor = '#10b981'; // emerald
      if (avgGpa < 7.0 || passRate < 80) {
        tier = 'Challenging';
        tierColor = '#f43f5e'; // rose
      } else if (avgGpa < 8.2 || passRate < 90) {
        tier = 'Moderate';
        tierColor = '#f59e0b'; // amber
      }

      return {
        courseCode,
        name,
        avgGpa,
        avgCie,
        avgAtt,
        failed,
        passed,
        total,
        passRate,
        tier,
        tierColor
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
      <div className="h-[400px] flex flex-col items-center justify-center opacity-70 text-sm">
        <BookOpen className="w-8 h-8 mb-2 opacity-50" />
        No subject analysis data available for this semester
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-700 shadow-2xl text-xs space-y-1.5 z-50 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
            <span className="font-extrabold text-sm text-slate-100">{data.name}</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white"
              style={{ backgroundColor: data.tierColor }}
            >
              {data.tier}
            </span>
          </div>
          <p className="font-mono text-slate-400">Code: <span className="text-white font-bold">{data.courseCode}</span></p>
          <div className="pt-1 space-y-1">
            <p className="text-slate-300">Mean GPA: <span className="font-bold text-sm theme-accent-text">{data.avgGpa.toFixed(2)}</span> / 10</p>
            <p className="text-slate-300">Mean CIE: <span className="theme-secondary-text font-bold">{data.avgCie.toFixed(1)}</span> / 50</p>
            <p className="text-slate-300">Pass Rate: <span className="font-bold text-emerald-400">{data.passRate}%</span> ({data.passed} Passed / {data.failed} Failed)</p>
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
          <BookOpen className="w-4 h-4 theme-accent-text" />
          <h3 className="text-base font-bold font-display">
            Subject Difficulty Spectrum
          </h3>
        </div>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          className="ui-card border border-slate-500/20 rounded-xl text-xs font-semibold py-1.5 px-3 focus:outline-none theme-accent-border shadow-sm"
        >
          <option value="gpa_desc">Sort: Easiest (Highest GPA)</option>
          <option value="gpa_asc">Sort: Hardest (Lowest GPA)</option>
          <option value="fails">Sort: Most Fails</option>
          <option value="cie">Sort: Lowest CIE</option>
        </select>
      </div>

      {/* Horizontal Bar Chart Container */}
      <div className="w-full flex-grow pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 15, left: 65, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis type="number" domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }} />
            <YAxis 
              type="category" 
              dataKey="courseCode" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }} 
              width={65}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(150, 150, 150, 0.08)' }} />
            <Bar dataKey="avgGpa" radius={[0, 6, 6, 0]} barSize={16} animationDuration={700}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.tierColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
