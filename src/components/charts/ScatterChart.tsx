'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" /> 
});

export default function ScatterChart({ students }: { students: any[] }) {
  if (!students || students.length === 0) return <div>No data available</div>;

  const xData = students.map(s => s.sgpa || 0);
  const yData = students.map(s => s.cgpa || 0);
  const textData = students.map(s => `${s.Name} (${s.USN})`);

  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#cbd5e1' : '#334155';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">SGPA vs CGPA</h3>
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            text: textData,
            mode: 'markers',
            type: 'scatter',
            marker: {
              size: 8,
              color: '#8b5cf6',
              opacity: 0.7,
              line: { width: 1, color: '#ffffff' }
            },
            hoverinfo: 'text+x+y',
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 40, r: 20, t: 20, b: 40 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: textColor },
          xaxis: {
            title: 'SGPA',
            gridcolor: gridColor,
            zerolinecolor: gridColor,
          },
          yaxis: {
            title: 'CGPA',
            gridcolor: gridColor,
            zerolinecolor: gridColor,
          },
          hovermode: 'closest'
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
