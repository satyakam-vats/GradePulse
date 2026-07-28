'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, BookOpen, GraduationCap, User, BarChart2 } from 'lucide-react';

interface StudentDetailModalProps {
  usn: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ usn, isOpen, onClose }: StudentDetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && usn) {
      setLoading(true);
      fetch(`/api/student/${usn}`)
        .then((res) => res.json())
        .then((resData) => {
          setData(resData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [usn, isOpen]);

  if (!isOpen) return null;

  const studentName = data?.student?.name || 'Student Details';
  const overallCgpa = data?.student?.overallCgpa || data?.cgpa || 0;
  const semesterResults = data?.semesterResults || data?.semesters || [];

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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 dark:bg-[#161e31] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {loading ? 'Loading...' : studentName}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>USN: {usn}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!loading && overallCgpa > 0 && (
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall CGPA</div>
                  <div className="text-2xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">
                    {Number(overallCgpa).toFixed(2)}
                  </div>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            {loading ? (
              <div className="py-12 text-center text-slate-400 animate-pulse">
                Fetching student academic records...
              </div>
            ) : !data ? (
              <div className="py-12 text-center text-slate-400">
                Failed to load student data.
              </div>
            ) : (
              <>
                {/* Semester Wise Performance List */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-500" /> Academic Results
                  </h3>

                  <div className="space-y-4">
                    {semesterResults.map((sem: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-display font-bold text-slate-900 dark:text-white">
                            Semester {sem.semesterNumber || sem.number || idx + 1}
                          </span>
                          <span className="font-display font-bold text-emerald-600 dark:text-emerald-400">
                            {Number(sem.sgpa || sem.SGPA || 0).toFixed(2)} SGPA
                          </span>
                        </div>

                        {/* Subject Chips */}
                        {sem.subjectResults && sem.subjectResults.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {sem.subjectResults.map((sub: any, sIdx: number) => (
                              <div key={sIdx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                                <span className="font-mono text-slate-600 dark:text-slate-400 truncate max-w-[180px]">
                                  {sub.courseCode || sub.subjectCode}
                                </span>
                                <span className="font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                  Grade: {sub.grade || 'P'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
