import { DateRange } from './date-range.model';

/**
 * Represents the active filter state across the dashboard.
 * Passed as @Input() to AnalyticsTableComponent and FilterBarComponent.
 */
export interface FilterConfig {
  /** Optional date range to restrict records by their `date` field */
  dateRange?: DateRange;
  /**
   * Optional array of months to include (inclusive).
   * Format: 'YYYY-MM' (e.g. ['2025-01', '2025-03'])
   */
  selectedMonths?: string[];
  /** Optional list of metric keys to display (defaults to all metrics) */
  selectedMetrics?: string[];
}
