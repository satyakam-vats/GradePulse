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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30">
          <Trophy className="w-3.5 h-3.5 text-amber-500" /> Rank 1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-300 dark:border-slate-700">
          <Medal className="w-3.5 h-3.5 text-slate-400" /> Rank 2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold text-xs border border-orange-500/30">
          <Award className="w-3.5 h-3.5 text-orange-500" /> Rank 3
        </span>
      );
    }
    return <span className="font-mono text-slate-400 text-xs font-semibold">#{index + 1}</span>;
  };

  return (
    <div className="w-full flex flex-col justify-between h-[380px]">
      {/* Search & Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Class Leaderboard
          </h3>
          <p className="text-xs text-slate-400">Click student row to inspect detailed performance radar</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search USN or Name..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
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
      <div className="overflow-x-auto flex-grow rounded-xl border border-slate-200/80 dark:border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 dark:bg-slate-850 text-slate-500 uppercase tracking-wider font-mono border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3 font-semibold">Rank</th>
              <th className="py-2.5 px-3 font-semibold">USN</th>
              <th className="py-2.5 px-3 font-semibold">Student Name</th>
              <th 
                onClick={() => handleSort('cgpa')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-emerald-500 select-none"
              >
                <div className="flex items-center gap-1">
                  CGPA {getSortIcon('cgpa')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('sgpa')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-emerald-500 select-none"
              >
                <div className="flex items-center gap-1">
                  SGPA {getSortIcon('sgpa')}
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
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
                    className="hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3">{getRankBadge(globalIndex)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400 font-semibold">{studentUsn}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{studentName}</td>
                    <td className="py-2.5 px-3 font-bold font-display text-emerald-600 dark:text-emerald-400 text-sm">{cgpaVal}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{sgpaVal}</td>
                    <td className="py-2.5 px-3 text-right">
                      {backlogs === 0 ? (
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider">
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
      <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
        <div>
          Showing {paginatedData.length} of {filteredAndSorted.length} Students
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-slate-700 dark:text-slate-300 font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
