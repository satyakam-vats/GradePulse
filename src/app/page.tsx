'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GraduationCap, Users, ArrowRight, Activity, Award, Sparkles, TrendingUp } from 'lucide-react';

type BatchData = {
  name: string;
  studentCount: number;
};

export default function LandingPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/batches')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBatches(data);
        else if (data.batches) setBatches(data.batches);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50/80 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative z-10 p-6 max-w-6xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight">
            Grade<span className="text-emerald-600 dark:text-emerald-400">Pulse</span>
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> SIT Academic Analytics Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight font-display mb-4">
            Academic Performance <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Decoded & Quantified.
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-medium">
            Explore CGPA distributions, SGPA trends, class leaderboards, and detailed subject analysis with precision.
          </p>
        </motion.div>

        {/* Batch Selection Card */}
        <div className="w-full max-w-xl">
          <div className="ui-card p-6 md:p-8 border-t-4 border-t-emerald-500 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h2 className="font-display font-bold text-lg">Select Academic Cohort</h2>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Active Cohort
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-16 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              </div>
            ) : (
              <div className="space-y-3">
                {batches.map((batch) => (
                  <button
                    key={batch.name}
                    onClick={() => router.push(`/${batch.name}`)}
                    className="w-full group p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 transition-all flex items-center justify-between text-left shadow-sm"
                  >
                    <div>
                      <div className="font-display text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        Batch {batch.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{batch.studentCount} Registered Students</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Feature Highlights */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xl mt-8">
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10 dark:bg-indigo-500/15 text-center shadow-sm">
            <div className="text-2xl font-black font-display text-indigo-600 dark:text-indigo-400">217</div>
            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">Students Analyzed</div>
          </div>
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 dark:bg-emerald-500/15 text-center shadow-sm">
            <div className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">8.34</div>
            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">Cohort Avg CGPA</div>
          </div>
          <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 dark:bg-cyan-500/15 text-center shadow-sm">
            <div className="text-2xl font-black font-display text-cyan-600 dark:text-cyan-400">100%</div>
            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5 font-medium">Pass Rate</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs font-medium text-slate-500 dark:text-slate-500 border-t border-slate-200/80 dark:border-slate-900">
        SIT GradePulse Analytics System &bull; High Performance Academic Visualizations
      </footer>
    </div>
  );
}
