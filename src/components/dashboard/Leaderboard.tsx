'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Trophy, Medal, Award, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Leaderboard({ students, onStudentClick }: { students: any[], onStudentClick: (s: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'cgpa', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleSort = (key: string) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...students];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => 
        (s.Name && s.Name.toLowerCase().includes(lower)) || 
        (s.usn && s.usn.toLowerCase().includes(lower)) ||
        (s.USN && s.USN.toLowerCase().includes(lower))
      );
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? a[sortConfig.key.toUpperCase()] ?? 0;
      const bValue = b[sortConfig.key] ?? b[sortConfig.key.toUpperCase()] ?? 0;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedData = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25">
          <Trophy className="w-3.5 h-3.5 text-slate-950" /> Rank 1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-black text-xs shadow-md shadow-slate-400/25">
          <Medal className="w-3.5 h-3.5 text-slate-950" /> Rank 2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25">
          <Award className="w-3.5 h-3.5 text-white" /> Rank 3
        </span>
      );
    }
    return <span className="font-mono text-slate-400 font-bold text-xs pl-2">#{index + 1}</span>;
  };

  return (
    <div className="w-full flex flex-col justify-between h-[380px]">
      {/* Search & Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Class Leaderboard
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Click any student row to view full performance radar</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search USN or Name..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 shadow-sm"
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

      {/* Table Container */}
      <div className="overflow-x-auto flex-grow rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/90 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3 font-extrabold">Rank</th>
              <th className="py-2.5 px-3 font-extrabold">USN</th>
              <th className="py-2.5 px-3 font-extrabold">Student Name</th>
              <th 
                onClick={() => handleSort('cgpa')}
                className="py-2.5 px-3 font-extrabold cursor-pointer hover:text-emerald-500 select-none"
              >
                <div className="flex items-center gap-1">
                  CGPA {getSortIcon('cgpa')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('sgpa')}
                className="py-2.5 px-3 font-extrabold cursor-pointer hover:text-indigo-500 select-none"
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
                <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">
                  No matching students found
                </td>
              </tr>
            ) : (
              paginatedData.map((student, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx;
                const studentUsn = student.usn || student.USN || '';
                const studentName = student.name || student.Name || 'Student';
                const cgpaVal = Number(student.cgpa || student.overallCgpa || 0).toFixed(2);
                const sgpaVal = Number(student.sgpa || 0).toFixed(2);
                const backlogs = Number(student.backlogCount || student.backlogs || 0);

                return (
                  <tr
                    key={studentUsn + idx}
                    onClick={() => onStudentClick(student)}
                    className="hover:bg-gradient-to-r hover:from-emerald-500/10 hover:via-teal-500/5 hover:to-indigo-500/10 cursor-pointer transition-all"
                  >
                    <td className="py-2.5 px-3">{getRankBadge(globalIndex)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 font-bold">{studentUsn}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{studentName}</td>
                    <td className="py-2.5 px-3 font-black font-display text-emerald-600 dark:text-emerald-400 text-sm">{cgpaVal}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">{sgpaVal}</td>
                    <td className="py-2.5 px-3 text-right">
                      {backlogs === 0 ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 uppercase tracking-wider shadow-sm">
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold border border-rose-500/30 uppercase tracking-wider shadow-sm">
                          {backlogs} Backlog{backlogs > 1 ? 's' : ''}
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
            className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-emerald-500/10 hover:border-emerald-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-500" />
          </button>
          <span className="px-2 font-mono text-slate-700 dark:text-slate-300 font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-emerald-500/10 hover:border-emerald-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-emerald-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
