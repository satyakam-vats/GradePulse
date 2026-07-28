'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, BookOpen, User, AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react';

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

  const student = data?.student;
  const studentName = student?.name || 'Student Details';
  const section = student?.section || 'A';
  const overallCgpa = student?.overallCgpa || 0;
  const creditsEarned = student?.creditsEarned || 0;
  const creditsToEarn = student?.creditsToEarn || 0;
  const semesterResults = student?.semesterResults || [];
  const subjectResults = student?.subjectResults || [];

  // Group subject results by semester number
  const subjectsBySem = new Map<number, any[]>();
  for (const sr of subjectResults) {
    const snum = sr.semester?.number || 1;
    if (!subjectsBySem.has(snum)) subjectsBySem.set(snum, []);
    subjectsBySem.get(snum)!.push(sr);
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50 dark:bg-[#161e31] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20 text-xl">
                {studentName ? studentName.charAt(0) : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                    {loading ? 'Loading Student...' : studentName}
                  </h2>
                  {!loading && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs border border-indigo-500/20">
                      Sec {section}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mt-1">
                  <span>USN: <strong className="text-slate-700 dark:text-slate-300">{usn}</strong></span>
                  <span>&bull;</span>
                  <span>Earned Credits: <strong className="text-emerald-600 dark:text-emerald-400">{creditsEarned} / {creditsEarned + creditsToEarn}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!loading && overallCgpa > 0 && (
                <div className="text-right bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Cumulative CGPA</div>
                  <div className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">
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
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
            {loading ? (
              <div className="py-16 text-center text-slate-400 animate-pulse font-medium">
                Fetching complete academic transcript, attendance & CIE data...
              </div>
            ) : !student ? (
              <div className="py-16 text-center text-slate-400 font-medium">
                Failed to load student data.
              </div>
            ) : (
              <>
                {/* Semester-by-Semester Deep Breakdown */}
                {semesterResults.map((semRes: any) => {
                  const snum = semRes.semester.number;
                  const subjects = subjectsBySem.get(snum) || [];

                  return (
                    <div key={snum} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                      {/* Semester Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-500" />
                          <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                            Semester {snum} ({semRes.semester.term})
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="text-slate-500">
                            Reg Credits: <strong className="text-slate-700 dark:text-slate-300">{semRes.creditsRegistered}</strong>
                          </span>
                          <span className="text-slate-500">&bull;</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-lg">
                            SGPA: {Number(semRes.sgpa).toFixed(2)}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                            CGPA: {Number(semRes.cgpa).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Course Detailed Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              <th className="py-2 px-2">Course</th>
                              <th className="py-2 px-2">Subject Name</th>
                              <th className="py-2 px-2 text-center">CIE Marks</th>
                              <th className="py-2 px-2 text-center">Attendance %</th>
                              <th className="py-2 px-2 text-center">Credits</th>
                              <th className="py-2 px-2 text-right">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                            {subjects.map((sub: any, idx: number) => {
                              const isLowAtt = sub.attendance > 0 && sub.attendance < 85;
                              const isFailed = ['F', 'DX', 'NE', 'AB', 'NP'].includes(sub.grade);

                              return (
                                <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors">
                                  <td className="py-2.5 px-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                    {sub.subject?.courseCode || sub.courseCode}
                                  </td>
                                  <td className="py-2.5 px-2 font-bold text-slate-800 dark:text-slate-200">
                                    {sub.subject?.name || sub.subjectName}
                                    {sub.backlogCleared && (
                                      <span className="ml-2 px-1.5 py-0.5 text-[9px] font-black rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                        Cleared in Retake (Orig: {sub.originalGrade})
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                                    {sub.cieMarks} / 50
                                  </td>
                                  <td className="py-2.5 px-2 text-center">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                                        isLowAtt
                                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                      }`}
                                    >
                                      {isLowAtt && <AlertTriangle className="w-3 h-3" />}
                                      {sub.attendance}%
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-600 dark:text-slate-400">
                                    {sub.creditsEarned}
                                  </td>
                                  <td className="py-2.5 px-2 text-right">
                                    <span
                                      className={`px-2.5 py-1 rounded-lg font-black font-display text-xs ${
                                        isFailed
                                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                          : sub.grade === 'O'
                                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                          : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                                      }`}
                                    >
                                      {sub.grade}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
