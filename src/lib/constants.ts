/**
 * Application wide constants
 */

export const GRADE_ORDER = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F', 'DX', 'NE'] as const;

export const GRADE_COLORS: Record<string, string> = {
  'O': '#10b981',   // emerald-500
  'A+': '#059669',  // emerald-600
  'A': '#3b82f6',   // blue-500
  'B+': '#2563eb',  // blue-600
  'B': '#6366f1',   // indigo-500
  'C': '#f59e0b',   // amber-500
  'P': '#f97316',   // orange-500
  'F': '#ef4444',   // red-500
  'DX': '#9ca3af',  // gray-400
  'NE': '#6b7280'   // gray-500
};

export const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
  'DX': 0,
  'NE': 0
};

export const SEMESTER_MAP: Record<string, number> = {
  'ODD 2024-25': 1,
  'EVEN 2024-25': 2,
  'ODD 2025-26': 3,
  'EVEN 2025-26': 4
};

export const COLOR_PALETTE = {
  primary: '#4f46e5', // indigo-600
  accent: '#f59e0b',  // amber-500
  success: '#10b981', // emerald-500
  danger: '#ef4444',  // red-500
  warning: '#f97316', // orange-500
  info: '#3b82f6'     // blue-500
};
