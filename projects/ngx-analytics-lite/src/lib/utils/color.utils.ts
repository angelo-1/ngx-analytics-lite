/** Built-in harmonious color palette for charts */
const DEFAULT_PALETTE: string[] = [
  '#6366f1', // Indigo
  '#22d3ee', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#06b6d4', // Sky
  '#84cc16', // Lime
  '#ec4899', // Pink
];

/**
 * Generates a color palette array of the requested length.
 * Cycles through the default palette if count exceeds its size.
 * Accepts an optional custom palette to use instead.
 *
 * @param count   - Number of colors needed
 * @param palette - Optional custom palette to cycle through
 * @returns Array of hex color strings
 *
 * @example
 * generatePalette(3) // ['#6366f1', '#22d3ee', '#f59e0b']
 * generatePalette(12) // cycles back to start after 10
 */
export function generatePalette(count: number, palette: string[] = DEFAULT_PALETTE): string[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
}

/**
 * Applies transparency to a hex color string.
 *
 * @param hex   - Hex color (e.g. '#6366f1')
 * @param alpha - Opacity value between 0 and 1
 * @returns rgba() color string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const [, r, g, b] = result;
  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${alpha})`;
}
