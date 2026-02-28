import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

import { AnalyticsDataSource, AnalyticsRecord } from '../../models/analytics-data.model';
import { FilterConfig } from '../../models/filter-config.model';
import { extractMonths, isInDateRange } from '../../utils/month.utils';

/**
 * Smart analytics table with:
 * - **Auto month column detection** — only renders columns for months present in filtered data
 * - **Date-range filtering** — hides out-of-range records
 * - **Month filtering** — selectedMonths support
 * - **Dynamic metric columns** — extends to any number of MetricConfig entries
 * - **Responsive layout** — horizontal scroll on small screens
 *
 * @example
 * <ngx-analytics-table
 *   [data]="analyticsDataSource"
 *   [filter]="activeFilter"
 * />
 */
@Component({
  selector: 'ngx-analytics-table',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ngx-table-container" role="region" aria-label="Analytics Table">
      <table class="ngx-table" aria-live="polite">
        <thead>
          <tr>
            <th scope="col" class="ngx-table__header ngx-table__header--label">Label</th>
            <th
              *ngFor="let month of visibleMonths"
              scope="col"
              class="ngx-table__header ngx-table__header--month"
            >
              {{ month + '-01' | date: 'MMM yyyy' }}
            </th>
            <th
              *ngFor="let metric of data?.metrics"
              scope="col"
              class="ngx-table__header ngx-table__header--metric"
            >
              {{ metric.label }}
              <span *ngIf="metric.unit" class="ngx-unit">({{ metric.unit }})</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let row of filteredRecords; trackBy: trackByDate"
            class="ngx-table__row"
          >
            <td class="ngx-table__cell ngx-table__cell--label">{{ row['label'] }}</td>
            <td
              *ngFor="let month of visibleMonths"
              class="ngx-table__cell ngx-table__cell--month"
            >
              {{ monthValue(row, month) | number: '1.0-2' }}
            </td>
            <td
              *ngFor="let metric of data?.metrics"
              class="ngx-table__cell ngx-table__cell--metric"
            >
              {{ row[metric.key] | number: '1.0-2' }}
            </td>
          </tr>
          <!-- Empty state row -->
          <tr *ngIf="!filteredRecords.length">
            <td
              class="ngx-table__cell ngx-table__cell--empty"
              [attr.colspan]="(visibleMonths.length) + (data?.metrics?.length ?? 0) + 1"
            >
              No records match the current filter.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .ngx-table-container {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .ngx-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      color: #374151;
    }
    .ngx-table__header {
      background: #f9fafb;
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.8rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }
    .ngx-table__row:hover { background: #f9fafb; }
    .ngx-table__row:last-child td { border-bottom: none; }
    .ngx-table__cell {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f3f4f6;
      white-space: nowrap;
    }
    .ngx-table__cell--label { font-weight: 500; color: #111827; }
    .ngx-table__cell--metric { font-variant-numeric: tabular-nums; }
    .ngx-table__cell--empty {
      text-align: center;
      color: #9ca3af;
      font-style: italic;
      padding: 2rem;
    }
    .ngx-unit { font-size: 0.75rem; color: #9ca3af; margin-left: 2px; }
  `],
})
export class AnalyticsTableComponent<T extends AnalyticsRecord = AnalyticsRecord>
  implements OnChanges {

  /** The analytics data source — required. */
  @Input({ required: true }) data!: AnalyticsDataSource<T>;

  /** Active filter — drives auto-month detection and row filtering. */
  @Input() filter: FilterConfig = {};

  /** Auto-computed: only months present in filtered records. */
  visibleMonths: string[] = [];

  /** Records after applying the filter. */
  filteredRecords: T[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.applyFilter();
  }

  /**
   * Returns the metric value for a specific month from a record.
   * Matches by 'YYYY-MM' prefix on the record's date field,
   * using the first metric as the month-column value.
   */
  monthValue(record: T, month: string): number {
    if (String(record['date']).startsWith(month)) {
      return Number(record[this.data.metrics[0]?.key]) || 0;
    }
    return 0;
  }

  trackByDate(_index: number, record: T): string {
    return String(record['date']);
  }

  private applyFilter(): void {
    if (!this.data?.records) {
      this.filteredRecords = [];
      this.visibleMonths = [];
      return;
    }

    let records = [...this.data.records];

    // ① Date range filter
    if (this.filter.dateRange?.from && this.filter.dateRange?.to) {
      records = records.filter(r =>
        isInDateRange(r['date'], this.filter.dateRange!.from, this.filter.dateRange!.to)
      );
    }

    // ② selectedMonths filter
    if (this.filter.selectedMonths?.length) {
      records = records.filter(r =>
        this.filter.selectedMonths!.some(m => String(r['date']).startsWith(m))
      );
    }

    this.filteredRecords = records as T[];

    // ③ Auto-detect months from FILTERED records only (not all records)
    this.visibleMonths = extractMonths(records.map(r => String(r['date'])));
  }
}
