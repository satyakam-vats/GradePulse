'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { BookOpen, ChevronRight, ArrowLeft, Calendar, Award } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50/70 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <nav className="flex items-center space-x-2 text-sm font-medium">
          <Link href={`/${batch}`} className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {decodedBatch}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{decodedBranch} Branch</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono mb-4">
            BRANCH: {decodedBranch} &bull; BATCH: {decodedBatch}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display mb-3">
            Select Academic Semester
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm">
            Access complete semester analytics, grade bands, subject breakdowns, and class leaderboards.
          </p>
        </motion.div>

        {/* Semester Cards Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-28 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              <div className="h-28 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {semesters.map((s) => (
                <button
                  key={s.number}
                  onClick={() => router.push(`/${batch}/${branch}/${s.number}`)}
                  className="group ui-card-hover p-6 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-display font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      Sem {s.number}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        Semester {s.number}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="inline-flex items-center gap-1 font-mono uppercase">
                          <Calendar className="w-3.5 h-3.5" /> {s.type}
                        </span>
                        {s.avgSgpa && (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                            <Award className="w-3.5 h-3.5" /> Avg {s.avgSgpa.toFixed(2)} SGPA
                          </span>
                        )}
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
