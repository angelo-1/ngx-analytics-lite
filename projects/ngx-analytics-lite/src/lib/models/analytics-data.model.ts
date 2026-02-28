/**
 * @fileoverview Core data models for ngx-analytics-lite.
 * All interfaces are generic and composable.
 */

/**
 * A single data record with a date and dynamic numeric metrics.
 * The [key: string] index allows any metric column to be added.
 */
export interface AnalyticsRecord {
  /** ISO 8601 date string: '2025-06-15' */
  date: string;
  /** Human-readable label for chart segments and table rows */
  label: string;
  [metric: string]: any;
}

/**
 * Top-level data source passed to all ngx-analytics-lite components.
 * @template T - Extends AnalyticsRecord to allow strongly-typed records
 */
export interface AnalyticsDataSource<T extends AnalyticsRecord = AnalyticsRecord> {
  /** Array of data records */
  records: T[];
  /** Metric column definitions — defines which keys to visualize */
  metrics: MetricConfig[];
}

/**
 * Describes a single metric column/dataset.
 */
export interface MetricConfig {
  /** Key within AnalyticsRecord that holds this metric's value */
  key: string;
  /** Display label used in chart legend, tooltip, table header */
  label: string;
  /** Chart.js-compatible color string. Auto-generated if omitted. */
  color?: string;
  /** Optional unit suffix displayed in tooltips and table cells (e.g. '$', '%') */
  unit?: string;
}
