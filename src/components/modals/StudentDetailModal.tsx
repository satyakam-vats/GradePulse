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
          className="relative w-full max-w-4xl ui-card rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-500/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl theme-accent-bg text-white font-bold flex items-center justify-center shadow-lg text-xl">
                {studentName ? studentName.charAt(0) : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black font-display">
                    {loading ? 'Loading Student...' : studentName}
                  </h2>
                  {!loading && (
                    <span className="px-2.5 py-0.5 rounded-lg theme-accent-bg text-white font-mono font-bold text-xs">
                      Sec {section}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono opacity-70 mt-1">
                  <span>USN: <strong className="font-bold">{usn}</strong></span>
                  <span>&bull;</span>
                  <span>Earned Credits: <strong className="theme-accent-text">{creditsEarned} / {creditsEarned + creditsToEarn}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!loading && overallCgpa > 0 && (
                <div className="text-right border theme-accent-border px-4 py-2 rounded-2xl">
                  <div className="text-[10px] theme-accent-text font-bold uppercase tracking-wider">Cumulative CGPA</div>
                  <div className="text-2xl font-black font-display theme-accent-text">
                    {Number(overallCgpa).toFixed(2)}
                  </div>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-slate-500/20 hover:opacity-100 opacity-70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
            {loading ? (
              <div className="py-16 text-center opacity-70 animate-pulse font-medium">
                Fetching complete academic transcript, attendance & CIE data...
              </div>
            ) : !student ? (
              <div className="py-16 text-center opacity-70 font-medium">
                Failed to load student data.
              </div>
            ) : (
              <>
                {/* Semester-by-Semester Deep Breakdown */}
                {semesterResults.map((semRes: any) => {
                  const snum = semRes.semester.number;
                  const subjects = subjectsBySem.get(snum) || [];

                  return (
                    <div key={snum} className="p-5 rounded-2xl border border-slate-500/20 ui-card space-y-4">
                      {/* Semester Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-500/20 pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 theme-accent-text" />
                          <h3 className="font-display font-extrabold text-base">
                            Semester {snum} ({semRes.semester.term})
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="opacity-70">
                            Reg Credits: <strong className="font-bold">{semRes.creditsRegistered}</strong>
                          </span>
                          <span className="opacity-40">&bull;</span>
                          <span className="theme-secondary-bg text-white font-bold px-2.5 py-1 rounded-lg">
                            SGPA: {Number(semRes.sgpa).toFixed(2)}
                          </span>
                          <span className="theme-accent-bg text-white font-bold px-2.5 py-1 rounded-lg">
                            CGPA: {Number(semRes.cgpa).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Course Detailed Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="opacity-70 font-mono uppercase text-[10px] tracking-wider border-b border-slate-500/20">
                            <tr>
                              <th className="py-2 px-2">Course</th>
                              <th className="py-2 px-2">Subject Name</th>
                              <th className="py-2 px-2 text-center">CIE Marks</th>
                              <th className="py-2 px-2 text-center">Attendance %</th>
                              <th className="py-2 px-2 text-center">Credits</th>
                              <th className="py-2 px-2 text-right">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-500/10">
                            {subjects.map((sub: any, idx: number) => {
                              const isLowAtt = sub.attendance > 0 && sub.attendance < 85;
                              const isFailed = ['F', 'DX', 'NE', 'AB', 'NP'].includes(sub.grade);

                              return (
                                <tr key={idx} className="hover:bg-slate-500/10 transition-colors">
                                  <td className="py-2.5 px-2 font-mono font-bold theme-accent-text">
                                    {sub.subject?.courseCode || sub.courseCode}
                                  </td>
                                  <td className="py-2.5 px-2 font-bold">
                                    {sub.subject?.name || sub.subjectName}
                                    {sub.backlogCleared && (
                                      <span className="ml-2 px-1.5 py-0.5 text-[9px] font-black rounded bg-cyan-500/20 text-cyan-500 border border-cyan-500/30">
                                        Cleared in Retake (Orig: {sub.originalGrade})
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-semibold opacity-80">
                                    {sub.cieMarks} / 50
                                  </td>
                                  <td className="py-2.5 px-2 text-center">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                                        isLowAtt
                                          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                                          : 'theme-accent-bg text-white'
                                      }`}
                                    >
                                      {isLowAtt && <AlertTriangle className="w-3 h-3" />}
                                      {sub.attendance}%
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-bold opacity-70">
                                    {sub.creditsEarned}
                                  </td>
                                  <td className="py-2.5 px-2 text-right">
                                    <span
                                      className={`px-2.5 py-1 rounded-lg font-black font-display text-xs ${
                                        isFailed
                                          ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                                          : sub.grade === 'O'
                                          ? 'theme-accent-bg text-white font-bold'
                                          : 'theme-secondary-bg text-white font-bold'
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
