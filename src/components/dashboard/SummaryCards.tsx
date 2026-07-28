'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CountUp = ({ value, isPercentage }: { value: number, isPercentage?: boolean }) => {
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

  return <span>{count.toFixed(isPercentage ? 1 : 2)}{isPercentage ? '%' : ''}</span>;
};

export default function SummaryCards({ stats }: { stats: any }) {
  if (!stats) return null;

  // We exclude Mean here because it's featured as the Hero metric in the layout.
  const cards = [
    { label: 'Median', value: stats.median || 0, color: 'text-emerald-500' },
    { label: 'Mode', value: stats.mode || 0, color: 'text-teal-500' },
    { label: 'Min', value: stats.min || 0, color: 'text-amber-500' },
    { label: 'Max', value: stats.max || 0, color: 'text-indigo-500' },
    { label: 'Students', value: stats.totalStudents || 0, color: 'text-slate-600 dark:text-slate-300' },
    { label: 'Pass Rate', value: stats.passPercentage || 0, color: 'text-emerald-600', isPercentage: true },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-center transition-all hover:bg-white dark:hover:bg-slate-800"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {card.label}
          </h3>
          <div className={`text-2xl font-bold font-display ${card.color}`}>
            <CountUp value={card.value} isPercentage={card.isPercentage} />
          </div>
        </div>
      ))}
    </div>
  );
}
