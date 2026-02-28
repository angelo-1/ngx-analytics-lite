/**
 * Performs a deep structural equality check between two values.
 * Used by BaseChartComponent to detect meaningful data changes
 * and prevent unnecessary Chart.js destroy/recreate cycles.
 *
 * Falls back to reference equality if JSON.stringify is not possible
 * (e.g. circular references or functions in the object).
 *
 * @param a - First value
 * @param b - Second value
 * @returns true if the two values are deeply equal
 *
 * @internal - Not part of the public API
 */
export function deepEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a === undefined || b === undefined) return false;
  if (typeof a !== typeof b) return false;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}
