'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SummaryCards from '@/components/dashboard/SummaryCards';
import DistributionChart from '@/components/charts/DistributionChart';
import GradeBandChart from '@/components/charts/GradeBandChart';
import SubjectAnalysis from '@/components/dashboard/SubjectAnalysis';
import Leaderboard from '@/components/dashboard/Leaderboard';
import StudentDetailModal from '@/components/modals/StudentDetailModal';
import CompareModal from '@/components/modals/CompareModal';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Users, Sparkles, Activity } from 'lucide-react';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { batch, branch, semester } = params;

  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<'cgpa' | 'sgpa'>('cgpa');

  // Modal states
  const [selectedStudentUsn, setSelectedStudentUsn] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

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
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    if (batch && branch && semester) {
      fetchData();
    }
  }, [batch, branch, semester]);

  const decodedBatch = decodeURIComponent((batch as string) || '');
  const decodedBranch = decodeURIComponent((branch as string) || '');
  const currentSem = Number(semester) || 1;

  const handleStudentClick = (student: any) => {
    setSelectedStudentUsn(student.USN || student.usn);
    setIsDetailModalOpen(true);
  };

  const currentStats = stats?.[metric] || {};
  const distributionData = currentStats?.distribution || [];
  const gradeBandsData = currentStats?.gradeBands || [];
  const subjectStatsData = stats?.subjectStats || [];

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#060913] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16 relative overflow-hidden">
      {/* Radiant Background Glows */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-indigo-500/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[400px] bg-gradient-to-l from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#060913]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs font-semibold">
            <Link href="/" className="text-slate-500 hover:text-emerald-500 transition-colors flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Batches
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href={`/${batch}`} className="text-slate-500 hover:text-emerald-500 transition-colors">
              {decodedBatch}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href={`/${batch}/${branch}`} className="text-slate-500 hover:text-emerald-500 transition-colors">
              {decodedBranch}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
              Sem {semester}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Compare Students
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Gradient Top Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 opacity-80" />
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        {/* Title & Semester Selector bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> {decodedBranch} Department &bull; Cohort {decodedBatch}
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
              Semester {semester} Analytics
            </h1>
          </div>

          {/* Controls: Metric Switcher & Semester Quick Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Semester Tabs */}
            <div className="flex bg-slate-200/80 dark:bg-slate-900/80 p-1 rounded-xl text-xs font-bold border border-slate-300/60 dark:border-slate-800 backdrop-blur-md">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => (
                <button
                  key={sNum}
                  onClick={() => router.push(`/${batch}/${branch}/${sNum}`)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    currentSem === sNum
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  S{sNum}
                </button>
              ))}
            </div>

            {/* Metric Switcher */}
            <div className="flex bg-slate-200/80 dark:bg-slate-900/80 p-1 rounded-xl text-xs font-bold border border-slate-300/60 dark:border-slate-800 backdrop-blur-md">
              <button
                onClick={() => setMetric('cgpa')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  metric === 'cgpa'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                CGPA
              </button>
              <button
                onClick={() => setMetric('sgpa')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  metric === 'sgpa'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                SGPA
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-44 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
              <div className="h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Asymmetric Hero Summary Cards */}
            <SummaryCards stats={stats} metric={metric} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Distribution Bar Chart (7 cols) */}
              <div className="lg:col-span-7 ui-card p-6 border-t-2 border-t-indigo-500">
                <DistributionChart
                  data={distributionData}
                  title={`${metric.toUpperCase()} Distribution Spectrum`}
                  metric={metric}
                />
              </div>

              {/* Grade Band Pie/Donut Chart (5 cols) */}
              <div className="lg:col-span-5 ui-card p-6 border-t-2 border-t-teal-500">
                <GradeBandChart data={gradeBandsData} />
              </div>
            </div>

            {/* Subject Analysis & Leaderboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Subject Breakdown (5 cols) */}
              <div className="lg:col-span-5 ui-card p-6 border-t-2 border-t-emerald-500">
                <SubjectAnalysis subjectStats={subjectStatsData} />
              </div>

              {/* Leaderboard Table (7 cols) */}
              <div className="lg:col-span-7 ui-card p-6 border-t-2 border-t-cyan-500">
                <Leaderboard students={students} onStudentClick={handleStudentClick} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <StudentDetailModal
        usn={selectedStudentUsn}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <CompareModal
        students={students}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
    </div>
  );
}
