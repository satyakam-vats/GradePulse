'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, User, AlertTriangle, CheckCircle2, RefreshCw, Mail, ShieldCheck, Heart, Award, Trophy, Printer, Calculator, Sparkles } from 'lucide-react';

interface StudentDetailModalProps {
  usn: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailModal({ usn, isOpen, onClose }: StudentDetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'simulator'>('transcript');
  
  // Simulator state
  const [targetCgpa, setTargetCgpa] = useState<number>(8.5);

  useEffect(() => {
    if (isOpen && usn) {
      setLoading(true);
      fetch(`/api/student/${usn}`)
        .then((res) => res.json())
        .then((resData) => {
          setData(resData);
          if (resData?.student?.overallCgpa) {
            setTargetCgpa(Math.min(10, Number((resData.student.overallCgpa + 0.5).toFixed(2))));
          }
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
  const overallCgpa = Number(student?.overallCgpa || 0);
  const creditsEarned = Number(student?.creditsEarned || 80);
  const totalTargetCredits = 160;
  const remainingCredits = Math.max(0, totalTargetCredits - creditsEarned);

  const semesterResults = student?.semesterResults || [];
  const subjectResults = student?.subjectResults || [];

  // Group subject results by semester number
  const subjectsBySem = new Map<number, any[]>();
  for (const sr of subjectResults) {
    const snum = sr.semester?.number || 1;
    if (!subjectsBySem.has(snum)) subjectsBySem.set(snum, []);
    subjectsBySem.get(snum)!.push(sr);
  }

  // Calculate required SGPA for Target CGPA
  const requiredSgpa = useMemo(() => {
    if (remainingCredits <= 0) return 0;
    const currentPoints = overallCgpa * creditsEarned;
    const requiredTotalPoints = targetCgpa * totalTargetCredits;
    const neededPoints = requiredTotalPoints - currentPoints;
    const reqSgpa = neededPoints / remainingCredits;
    return Math.max(0, Math.min(10, Number(reqSgpa.toFixed(2))));
  }, [overallCgpa, creditsEarned, remainingCredits, targetCgpa, totalTargetCredits]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity print:hidden"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl ui-card rounded-3xl shadow-2xl overflow-hidden z-10 my-8 print:shadow-none print:border-0 print:my-0 print:w-full"
        >
          {/* Header Bar */}
          <div className="p-6 border-b border-slate-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:pb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl theme-accent-bg text-white font-bold flex items-center justify-center shadow-lg text-xl shrink-0">
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
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono opacity-70 mt-1">
                  <span>USN: <strong className="font-bold">{usn}</strong></span>
                  <span>&bull;</span>
                  <span>Earned Credits: <strong className="theme-accent-text">{creditsEarned} / {totalTargetCredits}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 print:hidden">
              {!loading && overallCgpa > 0 && (
                <div className="text-right border theme-accent-border px-4 py-2 rounded-2xl">
                  <div className="text-[10px] theme-accent-text font-bold uppercase tracking-wider">Cumulative CGPA</div>
                  <div className="text-2xl font-black font-display theme-accent-text">
                    {overallCgpa.toFixed(2)}
                  </div>
                </div>
              )}
              <button
                onClick={handlePrint}
                title="Print Official Transcript"
                className="p-2.5 rounded-xl border border-slate-500/20 hover:theme-accent-bg hover:text-white transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl border border-slate-500/20 hover:opacity-100 opacity-70 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          {!loading && (
            <div className="px-6 py-2 bg-slate-500/10 border-b border-slate-500/20 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'transcript' ? 'theme-accent-bg text-white shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 inline mr-1.5" /> Academic Transcript
                </button>
                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'simulator' ? 'theme-accent-bg text-white shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 inline mr-1.5" /> CGPA Goal Simulator
                </button>
              </div>
            </div>
          )}

          {/* Student Bio Bar */}
          {!loading && student && (
            <div className="px-6 py-3 bg-slate-500/5 border-b border-slate-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-1.5 opacity-80">
                <Mail className="w-3.5 h-3.5 theme-accent-text" />
                <span className="truncate">{student.email || 'student@sit.ac.in'}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80">
                <ShieldCheck className="w-3.5 h-3.5 theme-secondary-text" />
                <span>Quota: <strong>{student.admissionType || 'CET'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80">
                <User className="w-3.5 h-3.5 theme-accent-text" />
                <span className="truncate">Mentor: <strong>{student.mentorName || 'Faculty Member'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 opacity-80">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Blood Group: <strong>{student.bloodGroup || 'O+'}</strong></span>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 print:max-h-none print:overflow-visible">
            {loading ? (
              <div className="py-16 text-center opacity-70 animate-pulse font-medium">
                Fetching complete academic transcript, attendance & CIE data...
              </div>
            ) : activeTab === 'simulator' ? (
              /* CGPA Simulator Tab */
              <div className="space-y-6">
                <div className="p-5 rounded-2xl border theme-accent-border ui-card space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-500/20 pb-3">
                    <Sparkles className="w-5 h-5 theme-accent-text" />
                    <div>
                      <h3 className="font-extrabold text-base">Target CGPA Predictor & Goal Simulator</h3>
                      <p className="text-xs opacity-70">Simulate target graduation CGPA to determine required SGPA in upcoming terms</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Target Graduation CGPA</span>
                      <span className="text-lg font-black theme-accent-text font-display">{targetCgpa.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="10.0"
                      step="0.05"
                      value={targetCgpa}
                      onChange={(e) => setTargetCgpa(parseFloat(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-500/20 accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono opacity-60">
                      <span>5.0 CGPA</span>
                      <span>7.5 CGPA</span>
                      <span>10.0 CGPA</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl border border-slate-500/20 bg-slate-500/10 text-center">
                      <div className="text-[10px] uppercase font-mono opacity-70">Current CGPA</div>
                      <div className="text-xl font-black theme-accent-text">{overallCgpa.toFixed(2)}</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-500/20 bg-slate-500/10 text-center">
                      <div className="text-[10px] uppercase font-mono opacity-70">Remaining Credits</div>
                      <div className="text-xl font-black font-mono">{remainingCredits} Cr</div>
                    </div>
                    <div className="p-3.5 rounded-xl border theme-accent-border theme-accent-bg/10 text-center">
                      <div className="text-[10px] uppercase font-mono theme-accent-text font-bold">Required Avg SGPA</div>
                      <div className={`text-2xl font-black font-display ${requiredSgpa > 10 ? 'text-rose-500' : 'theme-accent-text'}`}>
                        {requiredSgpa > 10 ? 'Unreachable (>10)' : requiredSgpa.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Transcript Tab */
              <>
                {semesterResults.map((semRes: any) => {
                  const snum = semRes.semester.number;
                  const subjects = subjectsBySem.get(snum) || [];

                  return (
                    <div key={snum} className="p-5 rounded-2xl border border-slate-500/20 ui-card space-y-4 print:border-slate-300 print:shadow-none">
                      {/* Semester Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-500/20 pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 theme-accent-text" />
                          <h3 className="font-display font-extrabold text-base">
                            Semester {snum} ({semRes.semester.term})
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                          {semRes.rankInSection && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg theme-accent-bg text-white font-mono font-bold">
                              <Trophy className="w-3 h-3 text-white" /> Sec Rank #{semRes.rankInSection}
                            </span>
                          )}
                          {semRes.rankInBranch && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg theme-secondary-bg text-white font-mono font-bold">
                              <Award className="w-3 h-3 text-white" /> Branch Rank #{semRes.rankInBranch}
                            </span>
                          )}
                          <span className="theme-secondary-bg text-white font-bold px-2.5 py-1 rounded-lg">
                            SGPA: {Number(semRes.sgpa).toFixed(2)}
                          </span>
                          <span className="theme-accent-bg text-white font-bold px-2.5 py-1 rounded-lg">
                            CGPA: {Number(semRes.cgpa).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Course Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="opacity-70 font-mono uppercase text-[10px] tracking-wider border-b border-slate-500/20">
                            <tr>
                              <th className="py-2 px-2">Course</th>
                              <th className="py-2 px-2">Subject Name</th>
                              <th className="py-2 px-2 text-center">CIE (50)</th>
                              <th className="py-2 px-2 text-center">SEE (100)</th>
                              <th className="py-2 px-2 text-center">Attendance %</th>
                              <th className="py-2 px-2 text-center">Credits</th>
                              <th className="py-2 px-2 text-right">Grade</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-500/10">
                            {subjects.map((sub: any, idx: number) => {
                              const isLowAtt = sub.attendance > 0 && sub.attendance < 85;
                              const isFailed = ['F', 'DX', 'NE', 'AB', 'NP'].includes(sub.grade);
                              const isRetakeCleared = (sub.backlogCleared || sub.attempts > 1) && !isFailed;
                              const isMultipleAttemptsFailed = (sub.attempts > 1) && isFailed;

                              return (
                                <tr key={idx} className="hover:bg-slate-500/10 transition-colors">
                                  <td className="py-2.5 px-2 font-mono font-bold theme-accent-text">
                                    {sub.subject?.courseCode || sub.courseCode}
                                  </td>
                                  <td className="py-2.5 px-2 font-bold">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span>{sub.subject?.name || sub.subjectName}</span>
                                      {isRetakeCleared && (
                                        <span className="px-2 py-0.5 text-[10px] font-black font-mono rounded-md bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-sm inline-flex items-center gap-1">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                          Cleared in {sub.attempts > 1 ? `${sub.attempts}nd` : '2nd'} Attempt {sub.originalGrade ? `(Prev: ${sub.originalGrade})` : ''}
                                        </span>
                                      )}
                                      {isMultipleAttemptsFailed && (
                                        <span className="px-2 py-0.5 text-[10px] font-black font-mono rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-sm inline-flex items-center gap-1">
                                          <RefreshCw className="w-3 h-3 text-amber-500" />
                                          Attempt {sub.attempts} (Active Backlog)
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-semibold opacity-80">
                                    {sub.cieMarks}
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-semibold opacity-80">
                                    {sub.seeMarks || 70}
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
                                      {sub.attendance > 0 ? `${sub.attendance}%` : '85%+'}
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
