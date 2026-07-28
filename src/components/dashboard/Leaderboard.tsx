'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Trophy, Medal, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Leaderboard({ 
  students, 
  onStudentClick,
  metric = 'cgpa'
}: { 
  students: any[], 
  onStudentClick: (s: any) => void,
  metric?: 'cgpa' | 'sgpa'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'desc' | 'asc' }>({ key: metric, direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync sort key whenever top-level metric toggle (CGPA / SGPA) changes
  useEffect(() => {
    setSortConfig({ key: metric, direction: 'desc' });
    setCurrentPage(1);
  }, [metric]);

  const handleSort = (key: string) => {
    let direction: 'desc' | 'asc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...students];

    if (selectedSection !== 'ALL') {
      result = result.filter(s => (s.section || 'A').toUpperCase() === selectedSection);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => 
        (s.Name && s.Name.toLowerCase().includes(lower)) || 
        (s.name && s.name.toLowerCase().includes(lower)) || 
        (s.usn && s.usn.toLowerCase().includes(lower)) ||
        (s.USN && s.USN.toLowerCase().includes(lower))
      );
    }

    result.sort((a, b) => {
      const aValue = Number(a[sortConfig.key] ?? a[sortConfig.key.toUpperCase()] ?? 0);
      const bValue = Number(b[sortConfig.key] ?? b[sortConfig.key.toUpperCase()] ?? 0);
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, selectedSection, sortConfig]);

  // Compute Sequential Serial Ranks (1, 2, 3, 3, 4, 5...)
  const ranksMap = useMemo(() => {
    const map = new Map<string, { rank: number; isTied: boolean }>();
    if (filteredAndSorted.length === 0) return map;

    let currentRank = 1;
    let previousValue = -1;

    for (let i = 0; i < filteredAndSorted.length; i++) {
      const s = filteredAndSorted[i];
      const usn = s.usn || s.USN;
      const val = Number(s[sortConfig.key] ?? s[sortConfig.key.toUpperCase()] ?? 0);

      if (i === 0) {
        previousValue = val;
        map.set(usn, { rank: 1, isTied: false });
      } else {
        if (Math.abs(val - previousValue) < 0.001) {
          // Tied with previous student - same rank number!
          map.set(usn, { rank: currentRank, isTied: true });
          const prevUsn = filteredAndSorted[i - 1].usn || filteredAndSorted[i - 1].USN;
          if (map.has(prevUsn)) {
            map.get(prevUsn)!.isTied = true;
          }
        } else {
          // Serial rank increment (+1)
          currentRank = currentRank + 1;
          previousValue = val;
          map.set(usn, { rank: currentRank, isTied: false });
        }
      }
    }
    return map;
  }, [filteredAndSorted, sortConfig.key]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedData = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  const getRankBadge = (usn: string) => {
    const rankInfo = ranksMap.get(usn) || { rank: 1, isTied: false };
    const r = rankInfo.rank;

    if (r === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25">
          <Trophy className="w-3.5 h-3.5 text-slate-950" /> Rank 1 {rankInfo.isTied && '(Tied)'}
        </span>
      );
    }
    if (r === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-black text-xs shadow-md shadow-slate-400/25">
          <Medal className="w-3.5 h-3.5 text-slate-950" /> Rank 2 {rankInfo.isTied && '(Tied)'}
        </span>
      );
    }
    if (r === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25">
          <Award className="w-3.5 h-3.5 text-white" /> Rank 3 {rankInfo.isTied && '(Tied)'}
        </span>
      );
    }
    return (
      <span className="font-mono text-slate-400 font-bold text-xs pl-2">
        Rank {r} {rankInfo.isTied && '(Tied)'}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col justify-between h-[420px]">
      {/* Search & Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            Class Leaderboard
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
              Sorted by {sortConfig.key.toUpperCase()}
            </span>
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Click any student row to view attendance & CIE breakdown</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Section Filter Pills */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold">
            {['ALL', 'A', 'B', 'C'].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setSelectedSection(sec);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSection === sec
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sec === 'ALL' ? 'All Sec' : `Sec ${sec}`}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search USN/Name..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-grow rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/90 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3 font-extrabold">Rank</th>
              <th className="py-2.5 px-3 font-extrabold">USN</th>
              <th className="py-2.5 px-3 font-extrabold">Student Name</th>
              <th className="py-2.5 px-3 font-extrabold">Sec</th>
              <th 
                onClick={() => handleSort('cgpa')}
                className={`py-2.5 px-3 font-extrabold cursor-pointer hover:text-emerald-500 select-none ${
                  sortConfig.key === 'cgpa' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  CGPA {getSortIcon('cgpa')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('sgpa')}
                className={`py-2.5 px-3 font-extrabold cursor-pointer hover:text-indigo-500 select-none ${
                  sortConfig.key === 'sgpa' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  SGPA {getSortIcon('sgpa')}
                </div>
              </th>
              <th className="py-2.5 px-3 font-extrabold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 font-medium">
                  No matching students found
                </td>
              </tr>
            ) : (
              paginatedData.map((student, idx) => {
                const studentUsn = student.usn || student.USN || '';
                const studentName = student.name || student.Name || 'Student';
                const section = student.section || student.Section || 'A';
                const cgpaVal = Number(student.cgpa || student.overallCgpa || 0).toFixed(2);
                const sgpaVal = Number(student.sgpa || 0).toFixed(2);
                const activeBacklogs = Number(student.activeBacklogs || 0);
                const clearedBacklogs = Number(student.clearedBacklogs || 0);

                return (
                  <tr
                    key={studentUsn + idx}
                    onClick={() => onStudentClick(student)}
                    className="hover:bg-gradient-to-r hover:from-indigo-500/10 hover:via-teal-500/5 hover:to-emerald-500/10 cursor-pointer transition-all"
                  >
                    <td className="py-2.5 px-3">{getRankBadge(studentUsn)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 font-bold">{studentUsn}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{studentName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[11px]">
                        Sec {section}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 font-black font-display text-emerald-600 dark:text-emerald-400 text-sm ${
                      sortConfig.key === 'cgpa' ? 'bg-emerald-500/10 rounded-md font-extrabold' : ''
                    }`}>
                      {cgpaVal}
                    </td>
                    <td className={`py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400 ${
                      sortConfig.key === 'sgpa' ? 'bg-indigo-500/10 rounded-md font-extrabold' : ''
                    }`}>
                      {sgpaVal}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {activeBacklogs === 0 ? (
                        clearedBacklogs > 0 ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-[10px] font-extrabold border border-cyan-500/30 uppercase tracking-wider shadow-sm">
                            Backlog Cleared
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 uppercase tracking-wider shadow-sm">
                            PASS
                          </span>
                        )
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold border border-rose-500/30 uppercase tracking-wider shadow-sm">
                          {activeBacklogs} Backlog{activeBacklogs > 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between pt-3 text-xs text-slate-500 font-medium">
        <div>
          Showing {paginatedData.length} of {filteredAndSorted.length} Students
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-indigo-500/10 hover:border-indigo-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-indigo-500" />
          </button>
          <span className="px-2 font-mono text-slate-700 dark:text-slate-300 font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-indigo-500/10 hover:border-indigo-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
