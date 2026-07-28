'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" /> 
});

export default function ScatterChart({ students }: { students: any[] }) {
  const [themeColors, setThemeColors] = useState({ primary: '#5bc0be', accent: '#06b6d4', text: '#f4f5f6' });

  useEffect(() => {
    const updateColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const primary = styles.getPropertyValue('--color-primary').trim() || '#5bc0be';
      const accent = styles.getPropertyValue('--color-accent').trim() || '#06b6d4';
      const text = styles.getPropertyValue('--foreground').trim() || '#f4f5f6';
      setThemeColors({ primary, accent, text });
    };

    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    return () => observer.disconnect();
  }, []);

  if (!students || students.length === 0) return <div>No data available</div>;

  const xData = students.map(s => s.sgpa || 0);
  const yData = students.map(s => s.cgpa || 0);
  const textData = students.map(s => `${s.Name || s.name} (${s.USN || s.usn})`);

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4 font-display">SGPA vs CGPA</h3>
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
              color: themeColors.primary,
              opacity: 0.8,
              line: { width: 1, color: themeColors.accent }
            },
            hoverinfo: 'text+x+y',
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 40, r: 20, t: 20, b: 40 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: themeColors.text, family: 'var(--font-sans)' },
          xaxis: {
            title: 'SGPA',
            gridcolor: 'rgba(150,150,150,0.2)',
            zerolinecolor: 'rgba(150,150,150,0.2)',
          },
          yaxis: {
            title: 'CGPA',
            gridcolor: 'rgba(150,150,150,0.2)',
            zerolinecolor: 'rgba(150,150,150,0.2)',
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
