'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { Cpu, Users, ChevronRight, LayoutGrid, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col relative bg-slate-50/70 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <nav className="flex items-center space-x-2 text-sm font-medium">
          <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Batches
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">Batch {decodedBatch}</span>
        </nav>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-mono mb-4">
            COHORT: {decodedBatch}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display mb-3">
            Select Academic Branch
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm">
            Choose a department branch to inspect detailed semester statistics and student rankings.
          </p>
        </motion.div>

        {/* Branch Cards Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-28 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              <div className="h-28 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b) => (
                <button
                  key={b.code}
                  onClick={() => router.push(`/${batch}/${b.code}`)}
                  className="group ui-card-hover p-6 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-display font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {b.code}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {b.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{b.studentCount} Students</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform group-hover:text-emerald-500" />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
