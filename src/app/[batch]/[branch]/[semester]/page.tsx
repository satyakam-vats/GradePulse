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
import { ArrowLeft, Users, Layers, Award, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link href="/" className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Batches
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href={`/${batch}`} className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {decodedBatch}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href={`/${batch}/${branch}`} className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              {decodedBranch}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Semester {semester}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-850 hover:bg-emerald-500/10 hover:border-emerald-500 text-xs font-semibold transition-all"
            >
              <Users className="w-3.5 h-3.5 text-emerald-500" /> Compare Students
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Title & Semester Selector bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider mb-1">
              <span>{decodedBranch} Department</span> &bull; <span>Cohort {decodedBatch}</span>
            </div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
              Semester {semester} Analytics
            </h1>
          </div>

          {/* Controls: Metric Switcher & Semester Quick Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Semester Tabs */}
            <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => (
                <button
                  key={sNum}
                  onClick={() => router.push(`/${batch}/${branch}/${sNum}`)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    currentSem === sNum
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  S{sNum}
                </button>
              ))}
            </div>

            {/* Metric Switcher */}
            <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setMetric('cgpa')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  metric === 'cgpa'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                CGPA
              </button>
              <button
                onClick={() => setMetric('sgpa')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  metric === 'sgpa'
                    ? 'bg-emerald-600 text-white shadow-sm'
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
            <div className="h-44 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              <div className="h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Asymmetric Hero Summary Cards */}
            <SummaryCards stats={stats} metric={metric} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Distribution Bar Chart (7 cols) */}
              <div className="lg:col-span-7 ui-card p-6">
                <DistributionChart
                  data={distributionData}
                  title={`${metric.toUpperCase()} Distribution`}
                  metric={metric}
                />
              </div>

              {/* Grade Band Pie/Donut Chart (5 cols) */}
              <div className="lg:col-span-5 ui-card p-6">
                <GradeBandChart data={gradeBandsData} />
              </div>
            </div>

            {/* Subject Analysis & Leaderboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Subject Breakdown (5 cols) */}
              <div className="lg:col-span-5 ui-card p-6">
                <SubjectAnalysis subjectStats={subjectStatsData} />
              </div>

              {/* Leaderboard Table (7 cols) */}
              <div className="lg:col-span-7 ui-card p-6">
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
