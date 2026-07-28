'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
    <div className="min-h-screen flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-50 dark:opacity-20" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-end">
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white font-display mb-6">
            Grade<span className="text-emerald-500">Pulse</span>.
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
            Uncover deep insights into student performance. Fast, tactile, and highly analytical.
          </p>
        </motion.div>

        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-4 flex items-center justify-between px-2"
          >
            <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Select Batch
            </h2>
            {!loading && <span className="text-xs text-slate-400">{batches.length} available</span>}
          </motion.div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-white/40 dark:bg-slate-900/40 rounded-xl animate-pulse border border-slate-200/50 dark:border-slate-800/50" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {batches.map((batch, index) => (
                  <motion.div
                    key={batch.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => router.push(`/${batch.name}`)}
                    className="cursor-pointer group flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-soft hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">
                        {batch.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <span className="text-sm font-medium">
                        {batch.studentCount} Students
                      </span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
