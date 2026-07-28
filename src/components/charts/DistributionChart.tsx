'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

export default function DistributionChart({ data, title, metric }: { data: any[], title: string, metric: string }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px]"
    >
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
          <XAxis 
            dataKey="range" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.5)', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
            labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1800} animationEasing="ease-out">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
