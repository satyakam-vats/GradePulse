/**
 * Utility functions for statistical calculations.
 */

export interface StatsResult {
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  stdDev: number;
  q1: number;
  q3: number;
  iqr: number;
  count: number;
  sum: number;
}

/**
 * Computes various statistical measures for a given array of numbers.
 */
export function computeStats(values: number[]): StatsResult {
  if (!values || values.length === 0) {
    return {
      mean: 0, median: 0, mode: 0, min: 0, max: 0, stdDev: 0,
      q1: 0, q3: 0, iqr: 0, count: 0, sum: 0
    };
  }

  const count = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / count;
  const min = sorted[0];
  const max = sorted[count - 1];

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  // Mode (rounded to 1 decimal for continuous data)
  const frequencyMap = new Map<number, number>();
  let maxFreq = 0;
  let mode = sorted[0];

  for (const val of sorted) {
    const rounded = Math.round(val * 10) / 10;
    const freq = (frequencyMap.get(rounded) || 0) + 1;
    frequencyMap.set(rounded, freq);
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = rounded;
    }
  }

  // Population Standard Deviation
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);

  // Quartiles
  const getPercentile = (p: number) => {
    const index = (count - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    if (upper >= count) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const q1 = getPercentile(0.25);
  const q3 = getPercentile(0.75);
  const iqr = q3 - q1;

  return {
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    mode: Number(mode.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    q1: Number(q1.toFixed(2)),
    q3: Number(q3.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
    count,
    sum: Number(sum.toFixed(2))
  };
}

/**
 * Computes histogram distribution buckets for CGPA/SGPA ranges.
 */
export function getDistribution(values: number[]): { range: string; count: number }[] {
  const buckets = [
    { range: "< 5.0", count: 0 },
    { range: "5.0 - 5.9", count: 0 },
    { range: "6.0 - 6.9", count: 0 },
    { range: "7.0 - 7.9", count: 0 },
    { range: "8.0 - 8.9", count: 0 },
    { range: "9.0 - 10.0", count: 0 },
  ];

  for (const val of values) {
    if (val >= 9.0) buckets[5].count++;
    else if (val >= 8.0) buckets[4].count++;
    else if (val >= 7.0) buckets[3].count++;
    else if (val >= 6.0) buckets[2].count++;
    else if (val >= 5.0) buckets[1].count++;
    else buckets[0].count++;
  }

  return buckets;
}

export function computePercentile(value: number, allValues: number[]): number {
  if (allValues.length === 0) return 0;
  const countBelow = allValues.filter(v => v < value).length;
  return Number(((countBelow / allValues.length) * 100).toFixed(1));
}

export function computeRank(value: number, allValues: number[]): number {
  if (allValues.length === 0) return 1;
  const countAbove = allValues.filter(v => v > value).length;
  return countAbove + 1;
}

export function getGradeBands(cgpas: number[]): { band: string; count: number; color: string }[] {
  const bands = [
    { band: "9-10 (Outstanding)", count: 0, color: "#10b981" },
    { band: "8-9 (Excellent)", count: 0, color: "#3b82f6" },
    { band: "7-8 (Very Good)", count: 0, color: "#6366f1" },
    { band: "6-7 (Good)", count: 0, color: "#f59e0b" },
    { band: "5-6 (Average)", count: 0, color: "#f97316" },
    { band: "<5 (Below Average)", count: 0, color: "#ef4444" }
  ];

  for (const cgpa of cgpas) {
    if (cgpa >= 9) bands[0].count++;
    else if (cgpa >= 8) bands[1].count++;
    else if (cgpa >= 7) bands[2].count++;
    else if (cgpa >= 6) bands[3].count++;
    else if (cgpa >= 5) bands[4].count++;
    else bands[5].count++;
  }

  return bands;
}

export function getPassFailRatio(creditsRegistered: number[], creditsEarned: number[]): { passed: number; failed: number; passPercentage: number } {
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < creditsRegistered.length; i++) {
    if (creditsEarned[i] >= creditsRegistered[i]) {
      passed++;
    } else {
      failed++;
    }
  }

  const total = passed + failed;
  const passPercentage = total > 0 ? Number(((passed / total) * 100).toFixed(1)) : 0;

  return { passed, failed, passPercentage };
}
