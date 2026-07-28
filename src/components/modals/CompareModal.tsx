'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface StudentBasicInfo {
  USN: string;
  Name: string;
}

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStudents: StudentBasicInfo[];
}

export default function CompareModal({ isOpen, onClose, allStudents }: CompareModalProps) {
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  
  const [selectedUsn1, setSelectedUsn1] = useState<string | null>(null);
  const [selectedUsn2, setSelectedUsn2] = useState<string | null>(null);

  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);

  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredStudents1 = allStudents.filter(s => 
    s.Name.toLowerCase().includes(search1.toLowerCase()) || 
    s.USN.toLowerCase().includes(search1.toLowerCase())
  ).slice(0, 5);

  const filteredStudents2 = allStudents.filter(s => 
    s.Name.toLowerCase().includes(search2.toLowerCase()) || 
    s.USN.toLowerCase().includes(search2.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    if (selectedUsn1 && selectedUsn2) {
      setLoading(true);
      setError(null);
      fetch(`/api/compare/${selectedUsn1}/${selectedUsn2}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch comparison data');
          return res.json();
        })
        .then(data => {
          setCompareData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [selectedUsn1, selectedUsn2]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setSearch1('');
      setSearch2('');
      setSelectedUsn1(null);
      setSelectedUsn2(null);
      setCompareData(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.3, duration: 0.5 } },
    exit: { y: 100, opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  // Prepare chart data
  let chartData: any[] = [];
  let commonSubjects: any[] = [];
  
  if (compareData && compareData.student1 && compareData.student2) {
    const s1Sems = compareData.student1.semesters || [];
    const s2Sems = compareData.student2.semesters || [];
    
    // Get unique semesters
    const semesters = Array.from(new Set([...s1Sems.map((s: any) => s.Semester), ...s2Sems.map((s: any) => s.Semester)])).sort();
    
    chartData = semesters.map(sem => {
      const s1Sem = s1Sems.find((s: any) => s.Semester === sem);
      const s2Sem = s2Sems.find((s: any) => s.Semester === sem);
      return {
        name: `Sem ${sem}`,
        [compareData.student1.info.Name.split(' ')[0]]: s1Sem ? Number(s1Sem.SGPA) : 0,
        [compareData.student2.info.Name.split(' ')[0]]: s2Sem ? Number(s2Sem.SGPA) : 0,
      };
    });

    // Find common subjects
    const s1Subs = compareData.student1.subjects || [];
    const s2Subs = compareData.student2.subjects || [];
    
    s1Subs.forEach((sub1: any) => {
      const match = s2Subs.find((sub2: any) => sub2.Course_Code === sub1.Course_Code);
      if (match) {
        commonSubjects.push({
          Course_Code: sub1.Course_Code,
          Subject_Name: sub1.Subject_Name,
          Grade1: sub1.Grade,
          Grade2: match.Grade,
          GPA1: sub1.GPA,
          GPA2: match.GPA
        });
      }
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6 sm:pb-4">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all flex flex-col max-h-[90vh]"
          >
            {/* Header & Close Button */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Compare Students</h2>
              <button
                type="button"
                className="rounded-md text-slate-400 hover:text-slate-500 focus:outline-none dark:hover:text-slate-300"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Search 1 */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student 1</label>
                  <input
                    type="text"
                    value={search1}
                    onChange={(e) => {
                      setSearch1(e.target.value);
                      setShowSuggestions1(true);
                      if (selectedUsn1) setSelectedUsn1(null);
                    }}
                    onFocus={() => setShowSuggestions1(true)}
                    placeholder="Search by Name or USN..."
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-sm sm:leading-6"
                  />
                  {showSuggestions1 && search1 && !selectedUsn1 && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredStudents1.map((s) => (
                        <li
                          key={s.USN}
                          className="relative cursor-default select-none py-2 pl-3 pr-9 text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          onClick={() => {
                            setSearch1(`${s.Name} (${s.USN})`);
                            setSelectedUsn1(s.USN);
                            setShowSuggestions1(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{s.Name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{s.USN}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Search 2 */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student 2</label>
                  <input
                    type="text"
                    value={search2}
                    onChange={(e) => {
                      setSearch2(e.target.value);
                      setShowSuggestions2(true);
                      if (selectedUsn2) setSelectedUsn2(null);
                    }}
                    onFocus={() => setShowSuggestions2(true)}
                    placeholder="Search by Name or USN..."
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-sm sm:leading-6"
                  />
                  {showSuggestions2 && search2 && !selectedUsn2 && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredStudents2.map((s) => (
                        <li
                          key={s.USN}
                          className="relative cursor-default select-none py-2 pl-3 pr-9 text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          onClick={() => {
                            setSearch2(`${s.Name} (${s.USN})`);
                            setSelectedUsn2(s.USN);
                            setShowSuggestions2(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{s.Name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{s.USN}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {loading && (
                <div className="flex py-12 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
                </div>
              )}
              {error && (
                <div className="py-12 text-center text-red-500">
                  <p>{error}</p>
                </div>
              )}

              {/* Comparison Data */}
              {!loading && !error && compareData && compareData.student1 && compareData.student2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Basic Stats Summary */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{compareData.student1.info.USN}</p>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{compareData.student1.info.Name}</h3>
                      <div className="mt-4 inline-block px-4 py-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                        <span className="text-sm text-slate-500">CGPA</span>
                        <p className={`text-3xl font-extrabold ${Number(compareData.student1.info.Overall_CGPA) > Number(compareData.student2.info.Overall_CGPA) ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                          {Number(compareData.student1.info.Overall_CGPA).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-lg">
                        VS
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Difference</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {Math.abs(Number(compareData.student1.info.Overall_CGPA) - Number(compareData.student2.info.Overall_CGPA)).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{compareData.student2.info.USN}</p>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{compareData.student2.info.Name}</h3>
                      <div className="mt-4 inline-block px-4 py-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                        <span className="text-sm text-slate-500">CGPA</span>
                        <p className={`text-3xl font-extrabold ${Number(compareData.student2.info.Overall_CGPA) > Number(compareData.student1.info.Overall_CGPA) ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                          {Number(compareData.student2.info.Overall_CGPA).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white text-center">Semester by Semester Comparison (SGPA)</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
                          <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#64748b" />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend />
                          <Bar dataKey={compareData.student1.info.Name.split(' ')[0]} fill="#6366f1" radius={[4, 4, 0, 0]} />
                          <Bar dataKey={compareData.student2.info.Name.split(' ')[0]} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Common Subjects Table */}
                  {commonSubjects.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Common Subjects</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                          <thead className="bg-white dark:bg-slate-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{compareData.student1.info.Name.split(' ')[0]}</th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider text-sky-600 dark:text-sky-400">{compareData.student2.info.Name.split(' ')[0]}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {commonSubjects.map((sub, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-slate-900 dark:text-white">{sub.Course_Code}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{sub.Subject_Name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="font-semibold text-slate-900 dark:text-white">{sub.Grade1}</span>
                                  <span className="ml-2 text-sm text-slate-500">({sub.GPA1})</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="font-semibold text-slate-900 dark:text-white">{sub.Grade2}</span>
                                  <span className="ml-2 text-sm text-slate-500">({sub.GPA2})</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
