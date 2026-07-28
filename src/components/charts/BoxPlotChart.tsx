'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl" /> 
});

export default function BoxPlotChart({ values, title }: { values: number[], title: string }) {
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

  if (!values || values.length === 0) return <div>No data available</div>;

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4 font-display">{title}</h3>
      <Plot
        data={[
          {
            y: values,
            type: 'box',
            name: 'Scores',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
            marker: { color: themeColors.primary },
            line: { color: themeColors.accent },
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 40, r: 20, t: 20, b: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: themeColors.text, family: 'var(--font-sans)' },
          yaxis: {
            gridcolor: 'rgba(150,150,150,0.2)',
            zerolinecolor: 'rgba(150,150,150,0.2)',
          }
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}
