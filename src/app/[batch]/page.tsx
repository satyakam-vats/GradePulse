'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { Users, ChevronRight, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col relative transition-colors duration-300">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] theme-accent-bg opacity-10 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <nav className="flex items-center space-x-2 text-sm font-medium">
          <Link href="/" className="flex items-center gap-1 opacity-70 hover:opacity-100 theme-accent-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Batches
          </Link>
          <span className="opacity-40">/</span>
          <span className="font-semibold">Batch {decodedBatch}</span>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ui-card text-xs font-mono font-bold theme-accent-text mb-4 border theme-accent-border shadow-sm">
            COHORT: {decodedBatch}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display mb-3">
            Select Academic Branch
          </h1>
          <p className="opacity-80 max-w-md mx-auto text-sm">
            Choose a department branch to inspect detailed semester statistics and student rankings.
          </p>
        </motion.div>

        {/* Branch Cards Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-28 ui-card rounded-xl animate-pulse" />
              <div className="h-28 ui-card rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map((b) => (
                <button
                  key={b.code}
                  onClick={() => router.push(`/${batch}/${b.code}`)}
                  className="group ui-card-hover p-6 text-left flex items-center justify-between border theme-accent-border shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl theme-accent-bg text-white flex items-center justify-center font-display font-bold text-lg group-hover:scale-105 transition-transform shadow-md">
                      {b.code}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg group-hover:theme-accent-text transition-colors">
                        {b.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs opacity-70 mt-1">
                        <Users className="w-3.5 h-3.5 theme-accent-text" />
                        <span>{b.studentCount} Students</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform theme-accent-text" />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
