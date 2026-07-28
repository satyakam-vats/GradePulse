'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" /> 
});

export default function BoxPlotChart({ values, title }: { values: number[], title: string }) {
  if (!values || values.length === 0) return <div>No data available</div>;

  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#cbd5e1' : '#334155';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">{title}</h3>
      <Plot
        data={[
          {
            y: values,
            type: 'box',
            name: 'Scores',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
            marker: { color: '#6366f1' },
            line: { color: '#4f46e5' },
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 40, r: 20, t: 20, b: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: textColor },
          yaxis: {
            gridcolor: gridColor,
            zerolinecolor: gridColor,
          }
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
