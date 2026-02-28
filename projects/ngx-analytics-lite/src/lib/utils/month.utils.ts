/**
 * Extracts sorted unique months ('YYYY-MM') from an array of ISO date strings.
 * Only months that are present in the dataset are returned.
 * Null, undefined, and empty string values are safely ignored.
 *
 * @param dates - Array of ISO 8601 date strings (e.g. '2025-06-15')
 * @returns Sorted unique month strings in 'YYYY-MM' format
 *
 * @example
 * extractMonths(['2025-03-10', '2025-01-05', '2025-03-22'])
 * // returns ['2025-01', '2025-03']
 */
export function extractMonths(dates: (string | null | undefined)[]): string[] {
  const unique = new Set(
    dates
      .filter((d): d is string => typeof d === 'string' && d.length >= 7)
      .map(d => d.substring(0, 7))
  );
  return Array.from(unique).sort();
}

/**
 * Checks whether a given ISO date string falls within an inclusive date range.
 *
 * @param dateStr - ISO 8601 date string to test
 * @param from    - Range start (inclusive)
 * @param to      - Range end (inclusive)
 * @returns true if dateStr is within [from, to]
 */
export function isInDateRange(
  dateStr: string,
  from: Date | string,
  to: Date | string
): boolean {
  const d = new Date(dateStr).getTime();
  return d >= new Date(from).getTime() && d <= new Date(to).getTime();
}
