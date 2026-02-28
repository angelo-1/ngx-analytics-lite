import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AnalyticsDataSource, AnalyticsRecord } from '../models/analytics-data.model';
import { FilterConfig } from '../models/filter-config.model';
import { isInDateRange } from '../utils/month.utils';

/**
 * Core analytics service for data transformation and filtering.
 *
 * Provided as `providedIn: null` so consumers control the injection scope —
 * either at root level or scoped to a dashboard feature module/component.
 *
 * @example
 * // In a standalone component:
 * providers: [AnalyticsService]
 *
 * @example
 * // In app.config.ts for app-wide availability:
 * providers: [AnalyticsService]
 */
@Injectable({ providedIn: null })
export class AnalyticsService {

  /**
   * Filters an AnalyticsDataSource by the given FilterConfig.
   * Returns an Observable for composability with RxJS pipelines.
   *
   * @param data   - Full AnalyticsDataSource to filter
   * @param filter - Active FilterConfig specifying date range and/or months
   * @returns Observable<AnalyticsDataSource<T>> - Filtered data source
   *
   * @example
   * this.analyticsService.getFilteredData(rawData, this.activeFilter)
   *   .subscribe(filtered => this.tableData = filtered);
   */
  getFilteredData<T extends AnalyticsRecord>(
    data: AnalyticsDataSource<T>,
    filter: FilterConfig
  ): Observable<AnalyticsDataSource<T>> {
    let records = [...data.records];

    // Apply date range filter
    if (filter.dateRange?.from && filter.dateRange?.to) {
      records = records.filter(r =>
        isInDateRange(r['date'], filter.dateRange!.from, filter.dateRange!.to)
      );
    }

    // Apply month filter (selectedMonths: 'YYYY-MM' format)
    if (filter.selectedMonths?.length) {
      records = records.filter(r =>
        filter.selectedMonths!.some(m => r['date']?.startsWith(m))
      );
    }

    // Apply metric filter — restrict metrics to only selected keys
    const metrics = filter.selectedMetrics?.length
      ? data.metrics.filter(m => filter.selectedMetrics!.includes(m.key))
      : data.metrics;

    return of({ records: records as T[], metrics });
  }

  /**
   * Computes the total value across all records for a given metric key.
   *
   * @param data      - AnalyticsDataSource
   * @param metricKey - The metric key to sum
   */
  getTotalForMetric<T extends AnalyticsRecord>(
    data: AnalyticsDataSource<T>,
    metricKey: string
  ): number {
    return data.records.reduce((sum, r) => sum + (Number(r[metricKey]) || 0), 0);
  }

  /**
   * Checks if all metric totals are zero across the data source.
   */
  isAllZero<T extends AnalyticsRecord>(data: AnalyticsDataSource<T>): boolean {
    return data.metrics.every(m => this.getTotalForMetric(data, m.key) === 0);
  }
}
