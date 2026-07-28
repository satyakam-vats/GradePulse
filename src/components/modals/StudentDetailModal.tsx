'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend } from 'recharts';

interface StudentDetailModalProps {
  usn: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ usn, isOpen, onClose }: StudentDetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && usn) {
      setLoading(true);
      setError(null);
      // Fetch student data
      fetch(`/api/student/${usn}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch student data');
          return res.json();
        })
        .then((resData) => {
          setData(resData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setData(null);
    }
  }, [usn, isOpen]);

  if (!isOpen) return null;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'O': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'A+': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'A': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'B+': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'B': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'C': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'P': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'F': 
      case 'DX': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'NE': return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.3, duration: 0.5 } },
    exit: { y: 100, opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

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
            className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all sm:my-8"
          >
            {/* Header / Close button */}
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block z-10">
              <button
                type="button"
                className="rounded-md text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:text-slate-300"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="h-[85vh] overflow-y-auto p-6 sm:p-8">
              {loading && (
                <div className="flex h-full items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
                </div>
              )}
              {error && (
                <div className="flex h-full items-center justify-center flex-col gap-4 text-red-500">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && data && (
                <div className="space-y-8">
                  {/* Student Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div>
                      <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                        {data.student?.Name || 'Unknown Student'}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 text-lg">
                          {data.student?.USN}
                        </span>
                        {data.student?.Gender && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                            {data.student.Gender}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                      <p className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Overall CGPA</p>
                      <p className="text-5xl font-black font-display text-emerald-600 dark:text-emerald-400">
                        {data.student?.Overall_CGPA ? Number(data.student.Overall_CGPA).toFixed(2) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-semibold mb-4 font-display text-slate-900 dark:text-white">Semester Performance (SGPA)</h3>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.semesters || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                            <XAxis dataKey="Semester" tick={{ fontSize: 12 }} stroke="#64748b" />
                            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#64748b" />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.5)', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                              itemStyle={{ color: '#10b981' }}
                            />
                            <Bar dataKey="SGPA" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1800} animationEasing="ease-out" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-semibold mb-4 font-display text-slate-900 dark:text-white">Subject Breakdown (Radar)</h3>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.subjects || []}>
                            <PolarGrid stroke="#334155" opacity={0.2} />
                            <PolarAngleAxis dataKey="Course_Code" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                            <Radar name="GPA" dataKey="GPA" stroke="#10b981" fill="#10b981" fillOpacity={0.6} animationDuration={1800} animationEasing="ease-out" />
                            <RechartsTooltip 
                               contentStyle={{ borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.5)', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Backlogs Warning */}
                  {data.backlogs && data.backlogs.length > 0 && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-900/30">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                            Active Backlogs ({data.backlogs.length})
                          </h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                            <ul className="list-disc space-y-1 pl-5">
                              {data.backlogs.map((backlog: any, idx: number) => (
                                <li key={idx}>
                                  {backlog.Course_Code} - {backlog.Course_Name} (Attempts: {backlog.Attempts})
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Semester Breakdown */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Semester Details</h3>
                    {data.semesters?.map((sem: any) => (
                      <div key={sem.Semester} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-4 sm:px-6 flex justify-between items-center">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Semester {sem.Semester}</h4>
                          <div className="flex gap-4">
                            <div className="text-sm">
                              <span className="text-slate-500 dark:text-slate-400">SGPA: </span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{Number(sem.SGPA).toFixed(2)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-slate-500 dark:text-slate-400">Credits: </span>
                              <span className="font-medium text-slate-900 dark:text-white">{sem.Credits_Earned}/{sem.Credits_Registered}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-white dark:bg-slate-900">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Course</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Credits</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">CIE</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">ATT</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Grade</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">GPA</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                              {data.subjects
                                ?.filter((s: any) => s.Semester === sem.Semester)
                                .map((subject: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-slate-900 dark:text-white">{subject.Course_Code}</span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]" title={subject.Subject_Name}>{subject.Subject_Name}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                    {subject.Credits_Earned}/{subject.Credits_Reg}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                    {subject.CIE || '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                    {subject.ATT ? `${subject.ATT}%` : '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getGradeColor(subject.Grade)}`}>
                                      {subject.Grade || 'N/A'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                                    {subject.GPA ? Number(subject.GPA).toFixed(1) : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
