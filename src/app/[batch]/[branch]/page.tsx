'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { BookOpen, ChevronRight, ArrowLeft, Calendar, Award, Sparkles, Users, Activity, CheckCircle2, Layers } from 'lucide-react';

type SemesterData = {
  number: number;
  term: string;
  type: string;
  avgSgpa: number | null;
};

export default function SemesterSelectorPage() {
  const router = useRouter();
  const params = useParams();
  const batch = params.batch as string;
  const branch = params.branch as string;
  
  const [semesters, setSemesters] = useState<SemesterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batch || !branch) return;
    fetch(`/api/semesters/${batch}/${branch}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSemesters(data);
        else if (data.semesters) setSemesters(data.semesters);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [batch, branch]);

  const decodedBatch = decodeURIComponent(batch || '');
  const decodedBranch = decodeURIComponent(branch || '');

  const semDescriptions: Record<number, string> = {
    1: 'First Year Foundation & Basic Engineering Mathematics',
    2: 'Basic Electrical, Electronics & Programming Fundamentals',
    3: 'Data Structures, Object-Oriented Logic & Discrete Math',
    4: 'Algorithms, Database Systems & Operating Systems Core'
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50/80 dark:bg-[#060913] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16 overflow-hidden">
      {/* Radiant Background Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-500/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 -left-32 w-96 h-96 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#060913]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs font-semibold">
            <Link href="/" className="text-slate-500 hover:text-emerald-500 transition-colors flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Batches
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href={`/${batch}`} className="text-slate-500 hover:text-emerald-500 transition-colors">
              {decodedBatch}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
              {decodedBranch} Branch
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-10 relative z-10 w-full flex-grow flex flex-col justify-center">
        {/* Title Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-800 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-4 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> COMPUTER SCIENCE & ENGINEERING &bull; COHORT {decodedBatch}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display text-slate-900 dark:text-white mb-3">
            Select Academic Semester
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm font-medium leading-relaxed">
            Choose a semester term below to explore grade distributions, class leaderboards, subject breakdowns, and section comparisons.
          </p>
        </motion.div>

        {/* Cohort Overview Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-lg mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cohort Strength</div>
              <div className="text-lg font-black font-display text-slate-900 dark:text-white">200 CS Students</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Scraped Terms</div>
              <div className="text-lg font-black font-display text-slate-900 dark:text-white">Semesters 1 - 4</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sections Covered</div>
              <div className="text-lg font-black font-display text-slate-900 dark:text-white">Sec A, Sec B & Sec C</div>
            </div>
          </div>
        </motion.div>

        {/* Semester Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full"
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-36 bg-slate-200/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {semesters.map((s) => (
                <button
                  key={s.number}
                  onClick={() => router.push(`/${batch}/${branch}/${s.number}`)}
                  className="group relative p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-left flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  {/* Subtle Top Gradient Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black font-display text-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                          S{s.number}
                        </div>
                        <div>
                          <h3 className="font-extrabold font-display text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Semester {s.number}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs font-mono uppercase font-bold text-slate-400">
                            <Calendar className="w-3.5 h-3.5" /> {s.term}
                          </span>
                        </div>
                      </div>

                      {s.avgSgpa && (
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs font-mono">
                          Avg {s.avgSgpa.toFixed(2)} SGPA
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                      {semDescriptions[s.number] || 'Comprehensive academic records, grade bands and subject breakdowns.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Explore Semester {s.number} Dashboard</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
