'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Award, Users, Sparkles, BarChart3, BookOpen, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper hook for smooth animated count-up numbers
function useAnimatedNumber(targetValue: number, decimals: number = 2, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = targetValue;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetValue, duration]);

  return displayValue.toFixed(decimals);
}

export default function SummaryCards({ 
  stats, 
  metric,
  semesterNumber = 1 
}: { 
  stats: any, 
  metric: 'sgpa' | 'cgpa',
  semesterNumber?: number 
}) {
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const spectrumRef = useRef<HTMLDivElement>(null);

  if (!stats) return null;

  const currentStats = stats[metric]?.stats || stats[metric] || {};
  const meanVal = currentStats.mean || 0;
  const medianVal = currentStats.median || 0;
  const minVal = currentStats.min || 0;
  const maxVal = currentStats.max || 0;
  const totalStudents = stats.totalStudents || 200;
  const subjectCount = 8; // Standard 8 Curriculum Courses per Semester

  // Animated Count-Up Numbers
  const animatedMean = useAnimatedNumber(meanVal);
  const animatedMedian = useAnimatedNumber(medianVal);
  const animatedMin = useAnimatedNumber(minVal);
  const animatedMax = useAnimatedNumber(maxVal);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spectrumRef.current) return;
    const rect = spectrumRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const score = percentage * 10;
    setHoverX(x);
    setHoveredScore(score);
  };

  const handleMouseLeave = () => {
    setHoveredScore(null);
  };

  // Mean position percentage on 0 - 10 scale
  const meanPct = Math.min(100, Math.max(0, (meanVal / 10) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
      {/* Dominant Hero Stat Card (7 cols) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className="lg:col-span-7 ui-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between border theme-accent-border shadow-lg transition-all"
      >
        {/* Continuous Animated Ambient Pulsing Mesh Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1], 
            opacity: [0.2, 0.4, 0.2],
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-12 -top-12 w-64 h-64 rounded-full theme-accent-bg opacity-20 blur-3xl pointer-events-none" 
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {/* Continuous Animated Live Heartbeat SVG Icon */}
              <div className="w-10 h-10 rounded-xl theme-accent-bg text-white flex items-center justify-center font-bold shadow-md overflow-hidden relative">
                <svg className="w-6 h-6 stroke-white fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <motion.path
                    d="M2 12h4l2-6 3 12 2-8 2 4h5"
                    initial={{ pathLength: 0, pathOffset: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0], pathOffset: [0, 0, 1, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest theme-accent-text font-mono block">
                  Cohort Mean {metric.toUpperCase()}
                </span>
                <span className="text-[11px] font-medium opacity-80">Primary Class Benchmark</span>
              </div>
            </div>

            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full theme-accent-bg text-white border theme-accent-border shadow-sm backdrop-blur-md"
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              Class Performance
            </motion.span>
          </div>

          {/* Main Mean Score Display with Theme Primary Text Color & Popover Above */}
          <div className="flex items-baseline gap-3 my-2">
            <motion.div 
              className="font-display text-6xl md:text-7xl font-black tracking-tight theme-accent-text drop-shadow-md"
            >
              {animatedMean}
            </motion.div>

            <div className="flex items-center gap-2">
              <span className="opacity-70 text-sm font-extrabold uppercase font-mono tracking-wider">
                / 10.00 Scale
              </span>

              {/* Info Popover Button */}
              <div className="relative group/info inline-block">
                <button className="w-6 h-6 rounded-full theme-accent-bg text-white hover:opacity-90 transition-all flex items-center justify-center cursor-pointer">
                  <Info className="w-3.5 h-3.5" />
                </button>

                {/* Popover Card Floating ABOVE the icon */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover/info:block w-64 p-3.5 bg-slate-950 text-white text-xs rounded-xl shadow-2xl border border-slate-700 backdrop-blur-xl z-50 transition-all pointer-events-none">
                  <div className="font-bold theme-accent-text mb-1">Cohort Mean Explanation</div>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    <strong>{meanVal.toFixed(2)}</strong> is the overall class average (mean {metric.toUpperCase()}) across all {totalStudents} students in Semester {semesterNumber}.
                  </p>
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-950" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Animated Spectrum Bar with Theme Accent Fill */}
        <div className="mt-6 pt-4 border-t border-slate-500/20 relative z-10">
          <div className="flex justify-between items-center text-xs mb-3 font-mono">
            {/* Min Indicator Dot */}
            <span className="text-rose-500 font-extrabold flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              Min: {animatedMin}
            </span>

            <span className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-1 opacity-80">
              Distribution Spectrum
            </span>

            {/* Max Indicator Dot */}
            <span className="theme-accent-text font-extrabold flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full theme-accent-bg opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 theme-accent-bg" />
              </span>
              Max: {animatedMax}
            </span>
          </div>

          {/* Interactive Spectrum Bar Container */}
          <div 
            ref={spectrumRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-4 bg-slate-500/20 rounded-full relative p-0.5 border border-slate-500/30 shadow-inner cursor-crosshair group/spectrum overflow-hidden"
          >
            {/* Active Range Fill using Theme Primary Color */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${meanPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full theme-accent-bg rounded-full shadow-md relative overflow-hidden"
            >
              {/* Continuous Sweeping Light Beam */}
              <motion.div 
                animate={{ x: ['-100%', '250%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
            </motion.div>

            {/* Continuous Bouncing Live Mean Pin Marker */}
            <motion.div 
              animate={{ y: ['-50%', '-65%', '-50%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 theme-accent-border shadow-lg flex items-center justify-center pointer-events-none z-20"
              style={{ left: `calc(${meanPct}% - 8px)` }}
            >
              <span className="w-1.5 h-1.5 rounded-full theme-accent-bg animate-ping" />
            </motion.div>

            {/* Dynamic Scrubbing Hover Marker & Tooltip */}
            {hoveredScore !== null && (
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white shadow-lg pointer-events-none z-30"
                style={{ left: `${hoverX}px` }}
              >
                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-[10px] font-mono font-bold rounded shadow-lg border border-slate-700 whitespace-nowrap">
                  Scale: {hoveredScore.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Secondary Stats Grid (5 cols) */}
      <div className="lg:col-span-5 grid grid-cols-2 gap-4">
        {/* Median Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="ui-card p-5 flex flex-col justify-between border-l-4 theme-accent-border relative overflow-hidden group transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2 relative z-10">
            <span className="text-xs font-black uppercase tracking-widest font-mono theme-accent-text">Median</span>
            
            <div className="w-8 h-8 rounded-xl theme-accent-bg text-white flex items-center justify-center shadow-md">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="font-display text-3xl font-black theme-accent-text">
              {animatedMedian}
            </div>
            <div className="text-xs font-semibold opacity-70 mt-1">50th Percentile</div>
          </div>
        </motion.div>

        {/* Active Subjects Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="ui-card p-5 flex flex-col justify-between border-l-4 theme-accent-border relative overflow-hidden group transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2 relative z-10">
            <span className="text-xs font-black uppercase tracking-widest font-mono theme-accent-text">Subjects</span>
            
            <div className="w-8 h-8 rounded-xl theme-accent-bg text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="font-display text-3xl font-black theme-accent-text">
              {subjectCount}
            </div>
            <div className="text-xs font-semibold opacity-70 mt-1">Curriculum Courses</div>
          </div>
        </motion.div>

        {/* Total Students Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="ui-card p-5 flex flex-col justify-between border-l-4 theme-accent-border relative overflow-hidden group transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2 relative z-10">
            <span className="text-xs font-black uppercase tracking-widest font-mono theme-accent-text">Enrolled</span>
            
            <div className="w-8 h-8 rounded-xl theme-accent-bg text-white flex items-center justify-center shadow-md">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="font-display text-3xl font-black theme-accent-text">
              {totalStudents}
            </div>
            <div className="text-xs font-semibold opacity-70 mt-1">Class Strength</div>
          </div>
        </motion.div>

        {/* Highest Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          whileHover={{ y: -3 }}
          className="ui-card p-5 flex flex-col justify-between border-l-4 theme-accent-border relative overflow-hidden group transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2 relative z-10">
            <span className="text-xs font-black uppercase tracking-widest font-mono theme-accent-text">Highest</span>
            
            <div className="w-8 h-8 rounded-xl theme-accent-bg text-white flex items-center justify-center shadow-md">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="font-display text-3xl font-black theme-accent-text">
              {animatedMax}
            </div>
            <div className="text-xs font-semibold opacity-70 mt-1">Rank 1 Score</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
