'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { ArrowUpDown, BarChart3, Trophy, Medal, Award } from 'lucide-react';

interface StudentItem {
  usn: string;
  name: string;
  section: string;
  cgpa: number | null;
  sgpa: number | null;
}

export default function DynamicBarChart({ 
  students,
  metric = 'cgpa'
}: { 
  students: StudentItem[],
  metric?: 'cgpa' | 'sgpa'
}) {
  const [sortKey, setSortKey] = useState<'cgpa' | 'sgpa' | 'usn' | 'name'>(metric);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [displayLimit, setDisplayLimit] = useState<number>(20);

  // Sync sortKey whenever metric changes at top level
  useEffect(() => {
    setSortKey(metric);
  }, [metric]);

  const processedData = useMemo(() => {
    let list = [...students];

    if (selectedSection !== 'ALL') {
      list = list.filter(s => (s.section || 'A').toUpperCase() === selectedSection);
    }

    list.sort((a, b) => {
      if (sortKey === 'cgpa') {
        const valA = a.cgpa ?? 0;
        const valB = b.cgpa ?? 0;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      if (sortKey === 'sgpa') {
        const valA = a.sgpa ?? 0;
        const valB = b.sgpa ?? 0;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      }
      if (sortKey === 'usn') {
        return sortOrder === 'desc' ? b.usn.localeCompare(a.usn) : a.usn.localeCompare(b.usn);
      }
      if (sortKey === 'name') {
        return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list.slice(0, displayLimit).map((s, index) => ({
      rankIndex: index + 1,
      usn: s.usn,
      shortName: s.name.split(' ')[0] || s.usn,
      fullName: s.name,
      section: s.section || 'A',
      cgpa: Number(s.cgpa || 0),
      sgpa: Number(s.sgpa || 0),
      value: sortKey === 'sgpa' ? Number(s.sgpa || 0) : Number(s.cgpa || 0)
    }));
  }, [students, sortKey, sortOrder, selectedSection, displayLimit]);

  const getBarFill = (val: number, rankIndex: number) => {
    if (sortOrder === 'desc') {
      if (rankIndex === 1) return '#fbbf24'; // Gold
      if (rankIndex === 2) return '#cbd5e1'; // Silver
      if (rankIndex === 3) return '#f97316'; // Bronze
    }

    if (val >= 9.8) return '#10b981'; // Emerald
    if (val >= 9.5) return '#06b6d4'; // Cyan
    if (val >= 9.0) return '#3b82f6'; // Royal Blue
    if (val >= 8.5) return '#6366f1'; // Indigo
    if (val >= 8.0) return '#8b5cf6'; // Purple
    if (val >= 7.0) return '#f59e0b'; // Amber
    return '#ef4444';                // Red
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const fill = getBarFill(d.value, d.rankIndex);
      return (
        <div className="p-3.5 bg-slate-900/95 border border-slate-700 text-white rounded-2xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md z-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fill }} />
            <div className="font-extrabold text-sm text-slate-100">{d.fullName}</div>
          </div>
          <div className="font-mono text-slate-400 pl-4">USN: {d.usn} | Sec {d.section}</div>
          <div className="flex gap-4 font-semibold pt-1 border-t border-slate-800 pl-4">
            <span className="text-emerald-400">CGPA: {d.cgpa.toFixed(2)}</span>
            <span className="text-indigo-400">SGPA: {d.sgpa.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" /> Dynamic Student Performance Spectrum
            <span className="text-xs font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Active: {sortKey.toUpperCase()}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Multi-tier rank colors highlight performance spread across sections</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {/* Section Selector */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
            {['ALL', 'A', 'B', 'C'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSection === sec
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sec === 'ALL' ? 'All Sec' : `Sec ${sec}`}
              </button>
            ))}
          </div>

          {/* Metric Sort Key */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
            <button
              onClick={() => setSortKey('cgpa')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortKey === 'cgpa' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
              }`}
            >
              CGPA
            </button>
            <button
              onClick={() => setSortKey('sgpa')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortKey === 'sgpa' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'
              }`}
            >
              SGPA
            </button>
          </div>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'))}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-indigo-500 flex items-center gap-1"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'High → Low' : 'Low → High'}</span>
          </button>

          {/* Display Limit */}
          <select
            value={displayLimit}
            onChange={(e) => setDisplayLimit(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs focus:outline-none"
          >
            <option value={15}>Top 15</option>
            <option value={30}>Top 30</option>
            <option value={50}>Top 50</option>
            <option value={200}>All 200</option>
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={700}>
              {processedData.map((entry) => (
                <Cell
                  key={`cell-${entry.usn}`}
                  fill={getBarFill(entry.value, entry.rankIndex)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
