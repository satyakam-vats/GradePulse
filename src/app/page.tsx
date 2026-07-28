'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { GraduationCap, Users, ArrowRight, Activity, Award, BarChart2 } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col relative bg-slate-50/70 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="relative z-10 p-6 max-w-6xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Award className="w-3.5 h-3.5" /> SIT Academic Performance Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-4">
            Academic Performance <br />
            <span className="text-emerald-600 dark:text-emerald-400">Decoded & Quantified.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Explore CGPA distributions, SGPA trends, class leaderboards, and detailed subject analysis with precision.
          </p>
        </motion.div>

        {/* Batch Selection Card */}
        <div className="w-full max-w-xl">
          <div className="ui-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-display font-semibold text-lg">Select Academic Cohort</h2>
              </div>
              <span className="text-xs font-mono text-slate-500">2024-2028 Active</span>
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
                    className="w-full group p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="font-display text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        Batch {batch.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{batch.studentCount} Registered Students</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-all flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick feature highlights */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xl mt-8">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-center">
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white">217</div>
            <div className="text-xs text-slate-500 mt-0.5">Students Analyzed</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-center">
            <div className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400">8.34</div>
            <div className="text-xs text-slate-500 mt-0.5">Cohort Avg CGPA</div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-center">
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">Pass Rate</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200/60 dark:border-slate-900">
        SIT GradePulse Analytics System &bull; High Performance Academic Visualizations
      </footer>
    </div>
  );
}
