'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Sparkles, GraduationCap, ArrowRight, Users, Award, BookOpen, Layers } from 'lucide-react';
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

  const totalStudents = batches.reduce((acc, b) => acc + (b.studentCount || 0), 0) || 322;

  return (
    <div className="min-h-screen transition-colors duration-300 pb-20 relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] theme-accent-bg opacity-10 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl theme-accent-bg text-white font-black text-lg flex items-center justify-center shadow-lg">
            G
          </div>
          <div>
            <span className="font-extrabold font-display text-xl tracking-tight">
              Grade<span className="theme-accent-text">Pulse</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full theme-accent-bg text-white shadow-sm">
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
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ui-card text-xs font-mono font-bold theme-accent-text mb-6 shadow-sm border theme-accent-border"
        >
          <Sparkles className="w-3.5 h-3.5 theme-accent-text" /> Academic Performance Analytics Portal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight leading-[1.1] mb-6"
        >
          Academic Performance <br />
          <span className="theme-accent-text">
            Decoded & Quantified.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
        >
          Explore branch-wise CGPA rankings, grade distributions, subject difficulty insights, and head-to-head student performance metrics.
        </motion.p>

        {/* Batch Selection Card Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-xl mx-auto p-2 ui-card rounded-3xl shadow-xl mb-12"
        >
          <div className="p-6 text-left border-b border-slate-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl theme-accent-bg text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Select Academic Cohort</h3>
                <p className="text-xs opacity-70">Choose batch to inspect semester analytics</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold theme-accent-bg text-white px-2.5 py-1 rounded-lg shadow-sm">
              Active Session
            </span>
          </div>

          <div className="p-3 space-y-2">
            {loading ? (
              <div className="h-20 ui-card rounded-2xl animate-pulse" />
            ) : (
              batches.map((b) => (
                <div
                  key={b.id || b.name}
                  onClick={() => router.push(`/${b.name}`)}
                  className="p-4 rounded-2xl border theme-accent-border ui-card hover:opacity-90 transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl theme-accent-bg text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-md">
                      {b.startYear ? `'${String(b.startYear).slice(2)}` : '24'}
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold font-display text-lg">
                        Batch {b.name}
                      </h4>
                      <p className="text-xs opacity-70 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 theme-accent-text" /> {b.studentCount || 322} Enrolled Students &bull; Computer & Information Science
                      </p>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-xl theme-accent-bg text-white flex items-center justify-center group-hover:translate-x-1 transition-all shadow-md">
                    <ArrowRight className="w-5 h-5 text-white" />
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
          <div className="p-4 rounded-2xl ui-card border border-slate-500/20 shadow-sm">
            <div className="text-2xl font-black font-display theme-accent-text mb-0.5">
              {totalStudents}
            </div>
            <div className="text-xs font-bold opacity-70 uppercase tracking-wider">Enrolled Students</div>
          </div>

          <div className="p-4 rounded-2xl ui-card border border-slate-500/20 shadow-sm">
            <div className="text-2xl font-black font-display theme-accent-text mb-0.5">
              4 Terms
            </div>
            <div className="text-xs font-bold opacity-70 uppercase tracking-wider">Semesters 1 - 4</div>
          </div>

          <div className="p-4 rounded-2xl ui-card border border-slate-500/20 shadow-sm">
            <div className="text-2xl font-black font-display theme-secondary-text mb-0.5">
              CS & IS
            </div>
            <div className="text-xs font-bold opacity-70 uppercase tracking-wider">Academic Branches</div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs font-mono opacity-70 py-4 relative z-10 border-t border-slate-500/20">
        GradePulse &bull; Siddaganga Institute of Technology &bull; Academic Analytics Portal
      </footer>
    </div>
  );
}
