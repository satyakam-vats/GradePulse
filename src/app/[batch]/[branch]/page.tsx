'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { ChevronRight, Calendar, Sparkles, Users, Activity, CheckCircle2, Layers } from 'lucide-react';

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

  const branchFullName = decodedBranch === 'CS' 
    ? 'COMPUTER SCIENCE & ENGINEERING' 
    : decodedBranch === 'IS' 
    ? 'INFORMATION SCIENCE & ENGINEERING' 
    : decodedBranch === 'AD'
    ? 'ARTIFICIAL INTELLIGENCE & DATA SCIENCE'
    : `${decodedBranch} DEPARTMENT`;

  const studentCountText = decodedBranch === 'CS' 
    ? '200 Students' 
    : decodedBranch === 'IS' 
    ? '122 Students' 
    : decodedBranch === 'AD'
    ? '54 Students'
    : 'Enrolled Students';

  const sectionsText = decodedBranch === 'CS' 
    ? 'Sec A, Sec B & Sec C' 
    : decodedBranch === 'IS'
    ? 'Sec A & Sec B'
    : 'Sec A';

  const semDescriptions: Record<number, string> = {
    1: 'First Year Foundation & Basic Engineering Mathematics',
    2: 'Basic Electrical, Electronics & Programming Fundamentals',
    3: 'Data Structures, Object-Oriented Logic & Discrete Math',
    4: 'Algorithms, Database Systems & Operating Systems Core'
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300 pb-16 overflow-hidden">
      {/* Radiant Background Glows using Theme Accent */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] theme-accent-bg opacity-15 blur-3xl pointer-events-none rounded-full" />

      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-30 ui-card rounded-none border-b border-slate-500/20 px-6 py-4 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs font-semibold">
            <Link href="/" className="opacity-70 hover:opacity-100 theme-accent-text transition-colors flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 theme-accent-text" /> Batches
            </Link>
            <span className="opacity-40">/</span>
            <Link href={`/${batch}`} className="opacity-70 hover:opacity-100 theme-accent-text transition-colors">
              {decodedBatch}
            </Link>
            <span className="opacity-40">/</span>
            <span className="theme-accent-bg text-white font-bold px-2 py-0.5 rounded-md font-mono text-[11px]">
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ui-card border theme-accent-border text-xs font-mono font-bold theme-accent-text mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 theme-accent-text" /> {branchFullName} &bull; COHORT {decodedBatch}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display mb-3">
            Select Academic Semester
          </h1>
          <p className="opacity-80 max-w-xl mx-auto text-sm font-medium leading-relaxed">
            Choose a semester term below to explore grade distributions, class leaderboards, subject breakdowns, and section comparisons.
          </p>
        </motion.div>

        {/* Cohort Overview Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 rounded-3xl ui-card border theme-accent-border shadow-lg mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-500/20 bg-slate-500/10">
            <div className="w-10 h-10 rounded-xl theme-accent-bg text-white flex items-center justify-center font-bold shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs opacity-70 font-bold uppercase tracking-wider">Cohort Strength</div>
              <div className="text-lg font-black font-display theme-accent-text">{studentCountText}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-500/20 bg-slate-500/10">
            <div className="w-10 h-10 rounded-xl theme-secondary-bg text-white flex items-center justify-center font-bold shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs opacity-70 font-bold uppercase tracking-wider">Academic Terms</div>
              <div className="text-lg font-black font-display theme-secondary-text">Semesters 1 - 4</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-500/20 bg-slate-500/10">
            <div className="w-10 h-10 rounded-xl theme-accent-bg text-white flex items-center justify-center font-bold shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs opacity-70 font-bold uppercase tracking-wider">Class Sections</div>
              <div className="text-lg font-black font-display theme-accent-text">{sectionsText}</div>
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
                <div key={n} className="h-36 ui-card rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {semesters.map((s) => (
                <button
                  key={s.number}
                  onClick={() => router.push(`/${batch}/${branch}/${s.number}`)}
                  className="group relative p-6 rounded-3xl ui-card-hover border theme-accent-border shadow-md transition-all text-left flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  {/* Subtle Top Gradient Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] theme-accent-bg opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl theme-accent-bg text-white font-black font-display text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          S{s.number}
                        </div>
                        <div>
                          <h3 className="font-extrabold font-display text-xl group-hover:theme-accent-text transition-colors">
                            Semester {s.number}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs font-mono uppercase font-bold opacity-70">
                            <Calendar className="w-3.5 h-3.5" /> {s.term}
                          </span>
                        </div>
                      </div>

                      {s.avgSgpa && (
                        <div className="px-3 py-1.5 rounded-xl theme-accent-bg text-white font-extrabold text-xs font-mono shadow-sm">
                          Avg {s.avgSgpa.toFixed(2)} SGPA
                        </div>
                      )}
                    </div>

                    <p className="text-xs opacity-75 font-medium leading-relaxed mb-4">
                      {semDescriptions[s.number] || 'Comprehensive academic records, grade bands and subject breakdowns.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-500/20 flex items-center justify-between text-xs font-bold theme-accent-text">
                    <span>Explore Semester {s.number} Dashboard</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform theme-accent-text" />
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
