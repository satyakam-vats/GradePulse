'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';

type BranchData = {
  code: string;
  name: string;
  studentCount: number;
};

export default function BranchSelectorPage() {
  const router = useRouter();
  const params = useParams();
  const batch = params.batch as string;
  
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batch) return;
    fetch(`/api/branches/${batch}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBranches(data);
        else if (data.branches) setBranches(data.branches);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [batch]);

  const decodedBatch = decodeURIComponent(batch || '');

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-50 dark:opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <nav className="flex items-center space-x-2 text-sm font-medium">
          <Link href="/" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            Batches
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-800 dark:text-slate-100">{decodedBatch}</span>
        </nav>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black font-display text-slate-900 dark:text-white mb-4">
            Select Branch
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Cohort {decodedBatch}
          </p>
        </motion.div>

        <div className="w-full max-w-2xl">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white/40 dark:bg-slate-900/40 rounded-xl animate-pulse border border-slate-200/50 dark:border-slate-800/50" />
              ))}
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-lg">No branches found for this batch.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {branches.map((branch, index) => (
                  <motion.div
                    key={branch.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => router.push(`/${batch}/${branch.code}`)}
                    className="cursor-pointer group flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-soft hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold font-display text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {branch.code}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100">
                          {branch.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <span className="text-sm font-medium">
                        {branch.studentCount} Students
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
