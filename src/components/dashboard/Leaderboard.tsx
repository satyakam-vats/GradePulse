'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard({ students, onStudentClick }: { students: any[], onStudentClick: (s: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'cgpa', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
        (s.USN && s.USN.toLowerCase().includes(lower))
      );
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Assign ranks after sorting by primary metric
    const rankKey = sortConfig.key === 'cgpa' ? 'cgpaRank' : 'sgpaRank';
    if (!sortConfig.key.includes('Rank')) {
      result.forEach((student, index) => {
        student.currentRank = index + 1;
      });
    }

    return result;
  }, [students, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentData = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const getBadge = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-glow"><Award className="w-5 h-5 text-amber-500" /></div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center"><Award className="w-5 h-5 text-slate-500 dark:text-slate-300" /></div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"><Award className="w-5 h-5 text-orange-600" /></div>;
    return <span className="text-slate-500 dark:text-slate-400 font-medium font-display">{rank}</span>;
  };

  const getRowClass = (rank: number) => {
    const base = "cursor-pointer transition-all group border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:-translate-y-[2px] hover:shadow-soft ";
    if (rank <= 3) return base + "bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20";
    return base + "hover:bg-slate-50 dark:hover:bg-slate-800/50";
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Class Leaderboard</h3>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by Name or USN..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold w-16 text-center">Rank</th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('USN')}>
                <div className="flex items-center gap-1">USN {getSortIcon('USN')}</div>
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('Name')}>
                <div className="flex items-center gap-1">Name {getSortIcon('Name')}</div>
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('cgpa')}>
                <div className="flex items-center gap-1">CGPA {getSortIcon('cgpa')}</div>
              </th>
              <th className="px-4 py-3 font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('sgpa')}>
                <div className="flex items-center gap-1">SGPA {getSortIcon('sgpa')}</div>
              </th>
              <th className="px-4 py-3 font-semibold">Credits Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
              {currentData.map((student, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.02 }}
                  key={student.USN || idx}
                  onClick={() => onStudentClick(student)}
                  className={getRowClass(student.currentRank || idx + 1)}
                >
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center">{getBadge(student.currentRank || idx + 1)}</div>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{student.USN}</td>
                  <td className="px-4 py-4 font-medium text-slate-800 dark:text-slate-200">{student.Name}</td>
                  <td className={`px-4 py-4 font-bold font-display ${(student.currentRank || idx + 1) <= 3 ? 'text-xl shimmer-text' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {student.cgpa?.toFixed(2) || '-'}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-600 dark:text-slate-300 font-display">{student.sgpa?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-4 text-slate-500 font-medium">{student.Credits_Earned || '-'}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {currentData.length === 0 && (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            No students found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} students
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
