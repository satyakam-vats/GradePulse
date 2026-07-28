'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { ArrowUpDown, BarChart3, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudentItem {
  usn: string;
  name: string;
  section: string;
  cgpa: number | null;
  sgpa: number | null;
  activeBacklogs?: number;
  clearedBacklogs?: number;
}

export default function DynamicBarChart({ 
  students,
  metric = 'cgpa'
}: { 
  students: StudentItem[],
  metric?: 'cgpa' | 'sgpa'
}) {
  const [sortKey, setSortKey] = useState<'cgpa' | 'sgpa' | 'usn' | 'name' | 'backlogs'>(metric);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [displayLimit, setDisplayLimit] = useState<number>(20);

  // Sync sortKey whenever top-level metric changes
  useEffect(() => {
    setSortKey(metric);
  }, [metric]);

  const totalCohortCount = students.length || 200;

  // 1. Master True Rank Map over full cohort sorted by CGPA Descending (Immutable across sort order)
  const masterRankMap = useMemo(() => {
    const sorted = [...students].sort((a, b) => (Number(b.cgpa || 0)) - (Number(a.cgpa || 0)));
    const map = new Map<string, { rank: number; topPercentile: number }>();
    const total = students.length || 200;

    let currentRank = 1;
    let prevVal = -1;

    for (let i = 0; i < sorted.length; i++) {
      const val = Number(sorted[i].cgpa || 0);
      const usn = sorted[i].usn;

      if (i === 0) {
        prevVal = val;
        map.set(usn, { rank: 1, topPercentile: Number(((1 / total) * 100).toFixed(2)) });
      } else {
        if (Math.abs(val - prevVal) < 0.001) {
          map.set(usn, { 
            rank: currentRank, 
            topPercentile: Number(((currentRank / total) * 100).toFixed(2)) 
          });
        } else {
          currentRank = i + 1;
          prevVal = val;
          map.set(usn, { 
            rank: currentRank, 
            topPercentile: Number(((currentRank / total) * 100).toFixed(2)) 
          });
        }
      }
    }
    return map;
  }, [students]);

  // 2. Process display data according to current filters & sort options
  const processedData = useMemo(() => {
    let list = [...students];

    // Filter by Section
    if (selectedSection !== 'ALL') {
      list = list.filter(s => (s.section || 'A').toUpperCase() === selectedSection);
    }

    // Filter by Performance Tier
    if (selectedTier !== 'ALL') {
      if (selectedTier === '9_PLUS') {
        list = list.filter(s => (s.cgpa || 0) >= 9.0);
      } else if (selectedTier === '8_TO_9') {
        list = list.filter(s => (s.cgpa || 0) >= 8.0 && (s.cgpa || 0) < 9.0);
      } else if (selectedTier === '7_TO_8') {
        list = list.filter(s => (s.cgpa || 0) >= 7.0 && (s.cgpa || 0) < 8.0);
      } else if (selectedTier === 'BACKLOG') {
        list = list.filter(s => Number(s.activeBacklogs || 0) > 0);
      }
    }

    // Sort Logic
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
      if (sortKey === 'backlogs') {
        const blA = Number(a.activeBacklogs || 0);
        const blB = Number(b.activeBacklogs || 0);
        return sortOrder === 'desc' ? blB - blA : blA - blB;
      }
      return 0;
    });

    return list.slice(0, displayLimit).map((s) => {
      const cgpa = Number(s.cgpa || 0);
      const sgpa = Number(s.sgpa || 0);
      let value = cgpa;
      if (sortKey === 'sgpa') value = sgpa;

      const activeBacklogs = Number(s.activeBacklogs || 0);
      const masterInfo = masterRankMap.get(s.usn) || { rank: 200, topPercentile: 100 };

      return {
        trueRank: masterInfo.rank,
        trueTopPercentile: masterInfo.topPercentile,
        usn: s.usn,
        shortName: s.name.split(' ')[0] || s.usn,
        fullName: s.name,
        section: s.section || 'A',
        cgpa,
        sgpa,
        activeBacklogs,
        clearedBacklogs: Number(s.clearedBacklogs || 0),
        value
      };
    });
  }, [students, sortKey, sortOrder, selectedSection, selectedTier, displayLimit, masterRankMap]);

  // Compute live summary stats for currently displayed data
  const summaryStats = useMemo(() => {
    if (processedData.length === 0) return { mean: '0.00', max: '0.00', min: '0.00' };
    const vals = processedData.map(d => d.value);
    const sum = vals.reduce((a, b) => a + b, 0);
    return {
      mean: (sum / vals.length).toFixed(2),
      max: Math.max(...vals).toFixed(2),
      min: Math.min(...vals).toFixed(2)
    };
  }, [processedData]);

  // Color generator based on true performance tier
  const getBarFill = (item: any) => {
    if (item.activeBacklogs > 0) return '#ef4444'; // Red for active backlogs in this semester
    if (item.trueRank === 1) return '#fbbf24'; // Gold
    if (item.trueRank === 2) return '#cbd5e1'; // Silver
    if (item.trueRank === 3) return '#f97316'; // Bronze
    return 'var(--color-primary)';
  };

  // Custom rich tooltip card with immutable true percentile
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const fill = getBarFill(d);
      const pct = d.trueTopPercentile.toFixed(2);

      let badgeLabel = `Top ${pct}% Cohort (Rank ${d.trueRank})`;
      if (d.activeBacklogs > 0) {
        badgeLabel = `${d.activeBacklogs} Active Backlog${d.activeBacklogs > 1 ? 's' : ''}`;
      } else if (d.trueRank === 1) {
        badgeLabel = `👑 Rank 1 (Top ${pct}%)`;
      } else if (d.trueRank === 2) {
        badgeLabel = `🥇 Rank 2 (Top ${pct}%)`;
      } else if (d.trueRank === 3) {
        badgeLabel = `🥉 Rank 3 (Top ${pct}%)`;
      }

      return (
        <div className="p-4 bg-slate-950 text-white border border-slate-700 rounded-2xl shadow-2xl text-xs space-y-2.5 backdrop-blur-xl z-50 min-w-[250px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: fill }} />
              <div>
                <p className="font-black text-sm text-slate-100">{d.fullName}</p>
                <p className="font-mono text-[11px] text-slate-400">USN: {d.usn} &bull; Sec {d.section}</p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono">CGPA</span>
              <span className="font-black theme-accent-text text-base font-display">{d.cgpa.toFixed(2)}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-mono">SGPA</span>
              <span className="font-bold theme-secondary-text text-base font-display">{d.sgpa.toFixed(2)}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            {d.activeBacklogs > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> {badgeLabel}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full theme-accent-bg text-white font-bold font-mono">
                <CheckCircle2 className="w-3 h-3 text-white shrink-0" /> {badgeLabel}
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full ui-card p-6 shadow-sm space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-display flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 theme-accent-text" /> Dynamic Student Performance Spectrum
          </h3>
          <p className="text-xs opacity-70">Interactive performance spectrum with precise percentile ranking</p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {/* Section Selector */}
          <div className="flex items-center p-1 ui-card rounded-xl">
            {['ALL', 'A', 'B', 'C'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedSection === sec
                    ? 'theme-accent-bg text-white font-bold shadow-sm'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {sec === 'ALL' ? 'All Sec' : `Sec ${sec}`}
              </button>
            ))}
          </div>

          {/* Sort Key Selector */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-500/20 ui-card font-bold text-xs focus:outline-none theme-accent-border shadow-sm"
          >
            <option value="cgpa">Sort: CGPA</option>
            <option value="sgpa">Sort: SGPA</option>
            <option value="usn">Sort: USN Serial Order</option>
            <option value="name">Sort: Student Name (A-Z)</option>
            <option value="backlogs">Sort: Backlogs</option>
          </select>

          {/* Performance Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-500/20 ui-card font-semibold text-xs focus:outline-none theme-accent-border shadow-sm"
          >
            <option value="ALL">All Tiers</option>
            <option value="9_PLUS">9.0+ Outstanding</option>
            <option value="8_TO_9">8.0 - 8.9 Excellent</option>
            <option value="7_TO_8">7.0 - 7.9 Good</option>
            <option value="BACKLOG">Has Backlogs</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'))}
            className="p-1.5 px-2.5 rounded-xl border border-slate-500/20 ui-card hover:theme-accent-border flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'High → Low' : 'Low → High'}</span>
          </button>

          {/* Display Limit */}
          <select
            value={displayLimit}
            onChange={(e) => setDisplayLimit(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-500/20 ui-card font-mono text-xs focus:outline-none shadow-sm"
          >
            <option value={15}>Top 15</option>
            <option value={30}>Top 30</option>
            <option value={50}>Top 50</option>
            <option value={200}>All 200</option>
          </select>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 px-4 rounded-xl border border-slate-500/20 ui-card text-xs">
        <div className="flex items-center gap-2 font-medium opacity-80">
          <Sparkles className="w-3.5 h-3.5 theme-accent-text" />
          Showing <span className="font-bold font-mono text-sm">{processedData.length}</span> of {students.length} Students
        </div>

        <div className="flex items-center gap-4 font-mono font-bold text-[11px]">
          <span className="theme-accent-text">Mean: {summaryStats.mean}</span>
          <span className="theme-secondary-text">Max: {summaryStats.max}</span>
          <span className="opacity-70">Min: {summaryStats.min}</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 10, fill: 'currentColor', fontWeight: 600 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'currentColor' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(150, 150, 150, 0.1)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={700}>
              {processedData.map((entry) => (
                <Cell
                  key={`cell-${entry.usn}`}
                  fill={getBarFill(entry)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
