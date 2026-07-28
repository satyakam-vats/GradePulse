/**
 * Utility functions
 */

/**
 * Merges Tailwind classes
 * @param classes - Array of class names or conditional classes
 * @returns Merged class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a number to a specified number of decimal places
 * @param n - Number to format
 * @param decimals - Number of decimal places (default 2)
 * @returns Formatted number string
 */
export function formatNumber(n: number, decimals: number = 2): string {
  if (isNaN(n)) return "0.00";
  return n.toFixed(decimals);
}

/**
 * Formats a number as a percentage
 * @param n - Number to format
 * @returns Formatted percentage string
 */
export function formatPercentage(n: number): string {
  if (isNaN(n)) return "0.0%";
  return `${n.toFixed(1)}%`;
}

/**
 * Gets initials from a full name
 * @param name - Full name
 * @returns Initials string (max 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
