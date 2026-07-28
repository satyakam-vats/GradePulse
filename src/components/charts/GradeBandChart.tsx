'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function GradeBandChart({ gradeBands, metric }: { gradeBands: any[], metric: string }) {
  if (!gradeBands || gradeBands.length === 0) return <div>No data available</div>;

  const total = gradeBands.reduce((sum, item) => sum + item.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full h-[400px] flex flex-col relative"
    >
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
        {metric.toUpperCase()} Grade Bands
      </h3>
      
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gradeBands}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="count"
              nameKey="band"
              animationDuration={1500}
            >
              {gradeBands.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{total}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">Students</span>
        </div>
      </div>
    </motion.div>
  );
}
