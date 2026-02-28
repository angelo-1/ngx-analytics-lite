import { AnalyticsRecord } from './analytics-data.model';

/**
 * Event payload emitted when a chart element (slice, bar, point) is clicked.
 * @template T - The AnalyticsRecord type for this dataset, for strongly-typed rawRecord access.
 *
 * @example
 * onSegmentClick(event: ChartClickEvent<MyRecord>): void {
 *   this.router.navigate(['/detail', event.label]);
 * }
 */
export interface ChartClickEvent<T extends AnalyticsRecord = AnalyticsRecord> {
  /** Type of chart that emitted this event */
  chartType: 'pie' | 'bar' | 'line';
  /** Zero-based index of the clicked element in the dataset */
  segmentIndex: number;
  /** Label string of the clicked element from Chart.js labels array */
  label: string;
  /** Numeric value of the clicked element */
  value: number;
  /** Original AnalyticsRecord corresponding to the clicked element */
  rawRecord?: T;
  /** The native DOM MouseEvent for position and modifier key access */
  nativeEvent: MouseEvent;
}
