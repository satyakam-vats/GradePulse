'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Sparkles, GraduationCap, ArrowRight, Layers, Award, BookOpen, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/batches')
      .then((res) => res.json())
      .then((data) => {
        setBatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const defaultBatch = batches[0] || { name: '2024-2028', studentCount: 200 };
  const totalStudents = defaultBatch.studentCount || 200;

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#060913] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/10 via-emerald-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-lg">
            G
          </div>
          <div>
            <span className="font-extrabold font-display text-xl tracking-tight text-slate-900 dark:text-white">
              Grade<span className="text-emerald-500">Pulse</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              SIT Tumakuru
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 text-center relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-800 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-6 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" /> High Performance Academic Analytics Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          Academic Performance <br />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">
            Decoded & Quantified.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
        >
          Explore section-wise CGPA rankings, subject difficulty breakdowns, attendance trends, and head-to-head student comparisons with precision.
        </motion.p>

        {/* Batch Selection Card Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-xl mx-auto p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl mb-12"
        >
          <div className="p-6 text-left border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Select Academic Cohort</h3>
                <p className="text-xs text-slate-500">Choose batch to inspect semester analytics</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              Active Session
            </span>
          </div>

          <div className="p-3 space-y-2">
            {loading ? (
              <div className="h-20 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            ) : (
              batches.map((b) => (
                <div
                  key={b.id || b.name}
                  onClick={() => router.push(`/${b.name}`)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                      {b.startYear ? `'${String(b.startYear).slice(2)}` : '24'}
                    </div>
                    <div>
                      <h4 className="font-extrabold font-display text-lg text-slate-900 dark:text-white">
                        Batch {b.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-500" /> {b.studentCount || totalStudents} Enrolled Students &bull; CS Branch
                      </p>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:translate-x-1 transition-all shadow-md shadow-emerald-500/30">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Global Key Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 backdrop-blur-md shadow-sm">
            <div className="text-2xl font-black font-display text-indigo-600 dark:text-indigo-400 mb-0.5">
              {totalStudents}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Regular CS Students</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 backdrop-blur-md shadow-sm">
            <div className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400 mb-0.5">
              4 Semesters
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam History Scraped</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 backdrop-blur-md shadow-sm">
            <div className="text-2xl font-black font-display text-amber-500 mb-0.5">
              3 Sections
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sec A, Sec B, Sec C</div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs font-mono text-slate-400 py-4 relative z-10 border-t border-slate-200/50 dark:border-slate-800/50">
        GradePulse &bull; Siddaganga Institute of Technology &bull; Computer Science Department
      </footer>
    </div>
  );
}
