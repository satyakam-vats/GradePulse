'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SummaryCards from '@/components/dashboard/SummaryCards';
import DistributionChart from '@/components/charts/DistributionChart';
import GradeBandChart from '@/components/charts/GradeBandChart';
import BoxPlotChart from '@/components/charts/BoxPlotChart';
import ScatterChart from '@/components/charts/ScatterChart';
import SubjectAnalysis from '@/components/dashboard/SubjectAnalysis';
import Leaderboard from '@/components/dashboard/Leaderboard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ArrowUpRight } from 'lucide-react';

const CountUp = ({ value, decimals = 2 }: { value: number, decimals?: number }) => {
  const [count, setCount] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const duration = 1000;
    const frames = 60;
    const step = (value - prevValue.current) / (duration / (1000 / frames));
    let current = prevValue.current;
    
    let req: number;
    const animate = () => {
      current += step;
      if ((step > 0 && current >= value) || (step < 0 && current <= value)) {
        setCount(value);
        prevValue.current = value;
      } else {
        setCount(current);
        req = requestAnimationFrame(animate);
      }
    };
    
    req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [value]);

  return <span>{count.toFixed(decimals)}</span>;
};

export default function DashboardPage() {
  const params = useParams();
  const { batch, branch, semester } = params;

  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<'cgpa' | 'sgpa'>('cgpa');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          fetch(`/api/stats/${batch}/${branch}/${semester}`),
          fetch(`/api/students/${batch}/${branch}/${semester}`)
        ]);
        
        const statsData = statsRes.ok ? await statsRes.json() : null;
        const studentsData = studentsRes.ok ? await studentsRes.json() : [];

        setStats(statsData);
        setStudents(studentsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [batch, branch, semester]);

  const decodedBatch = decodeURIComponent(batch as string);
  const decodedBranch = decodeURIComponent(branch as string);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
        <div className="animate-pulse space-y-12">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl col-span-2"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentStats: any = stats?.[metric] || {};
  const distributionData = currentStats?.distribution || [];
  const gradeBandsData = currentStats?.gradeBands || [];
  const subjectStatsData = stats?.subjectStats || [];
  
  const boxPlotValues = students.map((s: any) => s[metric]);
  const heroValue = currentStats?.mean || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300 relative">
      {/* Texture */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-50 dark:opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Navigation */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <nav className="flex items-center space-x-2 text-sm font-medium mb-3 overflow-x-auto whitespace-nowrap scrollbar-hide text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Batches</Link>
              <span>/</span>
              <Link href={`/${batch}`} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">{decodedBatch}</Link>
              <span>/</span>
              <Link href={`/${batch}/${branch}`} className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">{decodedBranch}</Link>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200">S{semester}</span>
            </nav>
            <h1 className="text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
              Cohort Overview
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-white/50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-md">
              <button
                onClick={() => setMetric('cgpa')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${metric === 'cgpa' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-soft' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                CGPA
              </button>
              <button
                onClick={() => setMetric('sgpa')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${metric === 'sgpa' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-soft' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                SGPA
              </button>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Hero Section & Secondary Stats */}
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dominant Hero Metric */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 glass-card rounded-3xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-6">
              Batch Average {metric.toUpperCase()}
            </h2>
            <div className="flex items-baseline gap-4">
              <span className="text-8xl md:text-9xl font-black font-display text-slate-900 dark:text-white tracking-tighter">
                <CountUp value={heroValue} />
              </span>
              <span className="text-2xl font-medium text-emerald-500 flex items-center">
                <ArrowUpRight className="w-8 h-8" />
              </span>
            </div>
          </motion.div>

          {/* Secondary Stats Chips */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1"
          >
            <SummaryCards stats={currentStats} />
          </motion.div>
        </section>

        {/* Charts: Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 glass-card p-6 rounded-3xl"
          >
            <DistributionChart data={distributionData} title={`${metric.toUpperCase()} Distribution`} metric={metric} />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1 glass-card p-6 rounded-3xl flex items-center justify-center"
          >
            <GradeBandChart gradeBands={gradeBandsData} metric={metric} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card p-6 rounded-3xl"
          >
            <BoxPlotChart values={boxPlotValues} title={`${metric.toUpperCase()} Spread`} />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card p-6 rounded-3xl"
          >
            <ScatterChart students={students} />
          </motion.div>
        </div>

        {/* Subject Analysis */}
        {subjectStatsData.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6 glass-card p-6 md:p-10 rounded-3xl"
          >
            <SubjectAnalysis subjectStats={subjectStatsData} />
          </motion.section>
        )}

        {/* Leaderboard */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card p-6 md:p-10 rounded-3xl"
        >
          <Leaderboard students={students} onStudentClick={(student) => console.log('Clicked', student)} />
        </motion.section>
      </div>
    </div>
  );
}
