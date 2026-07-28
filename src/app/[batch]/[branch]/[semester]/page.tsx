'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SummaryCards from '@/components/dashboard/SummaryCards';
import DistributionChart from '@/components/charts/DistributionChart';
import GradeBandChart from '@/components/charts/GradeBandChart';
import SubjectAnalysis from '@/components/dashboard/SubjectAnalysis';
import Leaderboard from '@/components/dashboard/Leaderboard';
import SectionComparison from '@/components/dashboard/SectionComparison';
import DynamicBarChart from '@/components/charts/DynamicBarChart';
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
  const sectionStatsData = stats?.sectionStats || [];

  return (
    <div className="min-h-screen transition-colors duration-300 pb-16 relative overflow-hidden">
      {/* Radiant Background Glows using theme primary color */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[350px] theme-accent-bg opacity-15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[400px] theme-secondary-bg opacity-15 blur-3xl pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 ui-card rounded-none border-x-0 border-t-0 px-6 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs font-semibold">
            <Link href="/" className="opacity-70 hover:opacity-100 transition-colors flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 theme-accent-text" /> Batches
            </Link>
            <span className="opacity-40">/</span>
            <Link href={`/${batch}`} className="opacity-70 hover:opacity-100 transition-colors">
              {decodedBatch}
            </Link>
            <span className="opacity-40">/</span>
            <Link href={`/${batch}/${branch}`} className="opacity-70 hover:opacity-100 transition-colors">
              {decodedBranch}
            </Link>
            <span className="opacity-40">/</span>
            <span className="theme-accent-bg text-white font-bold px-2 py-0.5 rounded-md font-mono shadow-sm">
              Sem {semester}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl theme-accent-bg text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:opacity-90"
            >
              <Users className="w-3.5 h-3.5 text-white" /> Compare Students
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Gradient Top Line matching theme accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] theme-accent-bg opacity-90" />
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 relative z-10 space-y-8">
        {/* Title & Semester Selector bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider theme-accent-text mb-1">
              <Sparkles className="w-3.5 h-3.5" /> {decodedBranch} Department &bull; Cohort {decodedBatch}
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight">
              Semester {semester} Analytics
            </h1>
          </div>

          {/* Controls: Metric Switcher & Semester Quick Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Semester Tabs */}
            <div className="flex ui-card p-1 rounded-xl text-xs font-bold shadow-sm">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sNum) => (
                <button
                  key={sNum}
                  onClick={() => router.push(`/${batch}/${branch}/${sNum}`)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    currentSem === sNum
                      ? 'theme-accent-bg text-white font-bold shadow-md'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  S{sNum}
                </button>
              ))}
            </div>

            {/* Metric Switcher */}
            <div className="flex ui-card p-1 rounded-xl text-xs font-bold shadow-sm">
              <button
                onClick={() => setMetric('cgpa')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metric === 'cgpa'
                    ? 'theme-accent-bg text-white font-bold shadow-md'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                CGPA
              </button>
              <button
                onClick={() => setMetric('sgpa')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  metric === 'sgpa'
                    ? 'theme-accent-bg text-white font-bold shadow-md'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                SGPA
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-44 ui-card animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 ui-card animate-pulse" />
              <div className="h-80 ui-card animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Asymmetric Hero Summary Cards */}
            <SummaryCards stats={stats} metric={metric} semesterNumber={currentSem} />

            {/* Section Comparison Cards */}
            <SectionComparison sectionStats={sectionStatsData} metric={metric} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Distribution Bar Chart (7 cols) */}
              <div className="lg:col-span-7 ui-card p-6 border-t-4 theme-accent-border">
                <DistributionChart
                  data={distributionData}
                  title={`${metric.toUpperCase()} Distribution Spectrum`}
                  metric={metric}
                />
              </div>

              {/* Grade Band Pie/Donut Chart (5 cols) */}
              <div className="lg:col-span-5 ui-card p-6 border-t-4 theme-accent-border">
                <GradeBandChart data={gradeBandsData} />
              </div>
            </div>

            {/* Subject Analysis & Leaderboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Subject Breakdown (5 cols) */}
              <div className="lg:col-span-5 ui-card p-6 border-t-4 theme-accent-border">
                <SubjectAnalysis subjectStats={subjectStatsData} />
              </div>

              {/* Leaderboard Table (7 cols) */}
              <div className="lg:col-span-7 ui-card p-6 border-t-4 theme-accent-border">
                <Leaderboard 
                  students={students} 
                  onStudentClick={handleStudentClick} 
                  metric={metric}
                />
              </div>
            </div>

            {/* Dynamic Interactive Student Spectrum Bar Representation */}
            <DynamicBarChart students={students} metric={metric} />
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
