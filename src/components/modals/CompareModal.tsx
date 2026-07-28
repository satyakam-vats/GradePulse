'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Search, ArrowRightLeft, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  students?: any[];
  allStudents?: any[];
}

export default function CompareModal({ isOpen, onClose, students, allStudents }: CompareModalProps) {
  const studentList = students || allStudents || [];

  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  const [selectedUsn1, setSelectedUsn1] = useState<string | null>(null);
  const [selectedUsn2, setSelectedUsn2] = useState<string | null>(null);

  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filtered1 = studentList.filter(s => {
    const name = s.name || s.Name || '';
    const usn = s.usn || s.USN || '';
    return name.toLowerCase().includes(search1.toLowerCase()) || usn.toLowerCase().includes(search1.toLowerCase());
  }).slice(0, 5);

  const filtered2 = studentList.filter(s => {
    const name = s.name || s.Name || '';
    const usn = s.usn || s.USN || '';
    return name.toLowerCase().includes(search2.toLowerCase()) || usn.toLowerCase().includes(search2.toLowerCase());
  }).slice(0, 5);

  useEffect(() => {
    if (selectedUsn1 && selectedUsn2) {
      setLoading(true);
      fetch(`/api/compare/${selectedUsn1}/${selectedUsn2}`)
        .then(res => res.json())
        .then(data => {
          setCompareData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedUsn1, selectedUsn2]);

  if (!isOpen) return null;

  const s1 = studentList.find(s => (s.usn || s.USN) === selectedUsn1);
  const s2 = studentList.find(s => (s.usn || s.USN) === selectedUsn2);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 dark:bg-[#161e31] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Head-to-Head Comparison
                </h2>
                <p className="text-xs text-slate-500">Select two students to compare semester metrics</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selectors Grid */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student 1 Selection */}
            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">
                Student 1
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search1}
                  onChange={(e) => setSearch1(e.target.value)}
                  placeholder="Search Student 1 Name/USN..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              {search1 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden text-xs">
                  {filtered1.map((st) => (
                    <button
                      key={st.usn || st.USN}
                      onClick={() => {
                        setSelectedUsn1(st.usn || st.USN);
                        setSearch1(st.name || st.Name);
                      }}
                      className="w-full text-left p-3 hover:bg-emerald-500/10 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{st.name || st.Name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{st.usn || st.USN}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Student 2 Selection */}
            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block">
                Student 2
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search2}
                  onChange={(e) => setSearch2(e.target.value)}
                  placeholder="Search Student 2 Name/USN..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              {search2 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden text-xs">
                  {filtered2.map((st) => (
                    <button
                      key={st.usn || st.USN}
                      onClick={() => {
                        setSelectedUsn2(st.usn || st.USN);
                        setSearch2(st.name || st.Name);
                      }}
                      className="w-full text-left p-3 hover:bg-emerald-500/10 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{st.name || st.Name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{st.usn || st.USN}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comparison Output */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {(!selectedUsn1 || !selectedUsn2) ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                Select both students above to view comparative analytics.
              </div>
            ) : loading ? (
              <div className="py-16 text-center text-slate-400 animate-pulse">
                Fetching comparative student data...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{s1?.usn || s1?.USN}</div>
                    <div className="text-lg font-bold font-display text-slate-900 dark:text-white mt-1">{s1?.name || s1?.Name}</div>
                    <div className="text-3xl font-extrabold font-display text-emerald-600 dark:text-emerald-400 mt-2">
                      {Number(s1?.cgpa || s1?.overallCgpa || 0).toFixed(2)} CGPA
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono">{s2?.usn || s2?.USN}</div>
                    <div className="text-lg font-bold font-display text-slate-900 dark:text-white mt-1">{s2?.name || s2?.Name}</div>
                    <div className="text-3xl font-extrabold font-display text-indigo-600 dark:text-indigo-400 mt-2">
                      {Number(s2?.cgpa || s2?.overallCgpa || 0).toFixed(2)} CGPA
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
