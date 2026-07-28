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
  const itemsPerPage = 10;

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

  // 1. Sort ALL students in cohort/section to determine absolute ranks
  const sortedAllStudents = useMemo(() => {
    let list = [...students];

    if (selectedSection !== 'ALL') {
      list = list.filter(s => (s.section || 'A').toUpperCase() === selectedSection);
    }

    list.sort((a, b) => {
      const aValue = Number(a[sortConfig.key] ?? a[sortConfig.key.toUpperCase()] ?? 0);
      const bValue = Number(b[sortConfig.key] ?? b[sortConfig.key.toUpperCase()] ?? 0);
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [students, selectedSection, sortConfig]);

  // 2. Compute True Absolute Ranks over full cohort
  const ranksMap = useMemo(() => {
    const map = new Map<string, { rank: number; isTied: boolean }>();
    if (sortedAllStudents.length === 0) return map;

    let currentRank = 1;
    let previousValue = -1;

    for (let i = 0; i < sortedAllStudents.length; i++) {
      const s = sortedAllStudents[i];
      const usn = s.usn || s.USN;
      const val = Number(s[sortConfig.key] ?? s[sortConfig.key.toUpperCase()] ?? 0);

      if (i === 0) {
        previousValue = val;
        map.set(usn, { rank: 1, isTied: false });
      } else {
        if (Math.abs(val - previousValue) < 0.001) {
          map.set(usn, { rank: currentRank, isTied: true });
          const prevUsn = sortedAllStudents[i - 1].usn || sortedAllStudents[i - 1].USN;
          if (map.has(prevUsn)) {
            map.get(prevUsn)!.isTied = true;
          }
        } else {
          currentRank = currentRank + 1;
          previousValue = val;
          map.set(usn, { rank: currentRank, isTied: false });
        }
      }
    }
    return map;
  }, [sortedAllStudents, sortConfig.key]);

  // 3. Apply Search Term filter without altering absolute ranks
  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedAllStudents;
    const lower = searchTerm.toLowerCase();
    return sortedAllStudents.filter(s => 
      (s.Name && s.Name.toLowerCase().includes(lower)) || 
      (s.name && s.name.toLowerCase().includes(lower)) || 
      (s.usn && s.usn.toLowerCase().includes(lower)) ||
      (s.USN && s.USN.toLowerCase().includes(lower))
    );
  }, [sortedAllStudents, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  const getRankBadge = (usn: string) => {
    const rankInfo = ranksMap.get(usn) || { rank: 1, isTied: false };
    const r = rankInfo.rank;

    if (r === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] shadow-sm whitespace-nowrap">
          <Trophy className="w-3 h-3 text-slate-950 shrink-0" /> Rank 1
        </span>
      );
    }
    if (r === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-black text-[11px] shadow-sm whitespace-nowrap">
          <Medal className="w-3 h-3 text-slate-950 shrink-0" /> Rank 2
        </span>
      );
    }
    if (r === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-amber-600 text-white font-black text-[11px] shadow-sm whitespace-nowrap">
          <Award className="w-3 h-3 text-white shrink-0" /> Rank 3
        </span>
      );
    }
    return (
      <span className="font-mono opacity-70 font-bold text-xs pl-1 whitespace-nowrap">
        Rank {r}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col justify-between min-h-[500px]">
      {/* Search & Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-bold font-display flex items-center gap-2">
            Class Leaderboard
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded theme-accent-bg text-white font-bold border theme-accent-border">
              Sorted by {sortConfig.key.toUpperCase()}
            </span>
          </h3>
          <p className="text-xs font-medium opacity-70">Click any student row to view attendance & CIE breakdown</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Section Filter Pills */}
          <div className="flex items-center p-1 ui-card rounded-xl text-xs font-semibold">
            {['ALL', 'A', 'B', 'C'].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setSelectedSection(sec);
                  setCurrentPage(1);
                }}
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

          {/* Search Bar */}
          <div className="relative w-full sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 theme-accent-text" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search USN/Name..."
              className="w-full pl-8 pr-7 py-1 rounded-xl border border-slate-500/20 bg-slate-500/10 text-xs font-medium focus:outline-none theme-accent-border shadow-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container with Auto Scroll so no rows are clipped */}
      <div className="w-full flex-grow rounded-xl border border-slate-500/20 shadow-inner overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs table-fixed min-w-[600px]">
          <thead className="bg-slate-500/10 uppercase tracking-wider font-mono border-b border-slate-500/20 text-[11px] sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="py-2.5 px-3 font-extrabold w-[95px]">Rank</th>
              <th className="py-2.5 px-3 font-extrabold w-[110px]">USN</th>
              <th className="py-2.5 px-3 font-extrabold">Student Name</th>
              <th className="py-2.5 px-2 font-extrabold text-center w-[65px]">Sec</th>
              <th 
                onClick={() => handleSort('cgpa')}
                className={`py-2.5 px-3 font-extrabold cursor-pointer hover:opacity-100 select-none w-[75px] ${
                  sortConfig.key === 'cgpa' ? 'theme-accent-text font-extrabold' : ''
                }`}
              >
                <div className="flex items-center gap-0.5">
                  CGPA {getSortIcon('cgpa')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('sgpa')}
                className={`py-2.5 px-3 font-extrabold cursor-pointer hover:opacity-100 select-none w-[75px] ${
                  sortConfig.key === 'sgpa' ? 'theme-secondary-text font-extrabold' : ''
                }`}
              >
                <div className="flex items-center gap-0.5">
                  SGPA {getSortIcon('sgpa')}
                </div>
              </th>
              <th className="py-2.5 px-3 font-extrabold text-right w-[100px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-500/10 font-sans">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 opacity-70 font-medium">
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
                    className="hover:bg-slate-500/10 cursor-pointer transition-all"
                  >
                    <td className="py-2.5 px-3">{getRankBadge(studentUsn)}</td>
                    <td className="py-2.5 px-3 font-mono opacity-70 font-bold truncate text-[11px]">{studentUsn}</td>
                    <td className="py-2.5 px-3 font-bold truncate">{studentName}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="inline-block px-1.5 py-0.5 rounded theme-accent-bg text-white font-mono font-bold text-[10px]">
                        Sec {section}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 font-black font-display text-xs ${
                      sortConfig.key === 'cgpa' ? 'theme-accent-text font-extrabold' : ''
                    }`}>
                      {cgpaVal}
                    </td>
                    <td className={`py-2.5 px-3 font-bold text-xs ${
                      sortConfig.key === 'sgpa' ? 'theme-secondary-text font-extrabold' : ''
                    }`}>
                      {sgpaVal}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {activeBacklogs === 0 ? (
                        clearedBacklogs > 0 ? (
                          <span className="inline-flex px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-500 text-[9px] font-extrabold border border-cyan-500/30 uppercase tracking-wider">
                            Cleared
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full theme-accent-bg text-white text-[9px] font-extrabold shadow-sm uppercase tracking-wider">
                            PASS
                          </span>
                        )
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-[9px] font-extrabold border border-rose-500/30 uppercase tracking-wider">
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
      <div className="flex items-center justify-between pt-3 text-xs opacity-70 font-medium">
        <div>
          Showing {paginatedData.length} of {filteredData.length} Students
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-lg border border-slate-500/20 disabled:opacity-30 hover:theme-accent-bg hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono font-bold text-xs">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg border border-slate-500/20 disabled:opacity-30 hover:theme-accent-bg hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
