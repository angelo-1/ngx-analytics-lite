import { Injectable, inject } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { AnalyticsDataSource, AnalyticsRecord } from '../models/analytics-data.model';
import { NgxChartConfig } from '../models/chart-config.model';
import { ANALYTICS_CONFIG } from '../tokens/analytics-config.token';
import { generatePalette } from '../utils/color.utils';

/**
 * Shared Chart.js configuration builder service.
 * Used internally by chart components to DRY up common config-building logic.
 *
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class ChartConfigService {

  private readonly libConfig = inject(ANALYTICS_CONFIG);

  /**
   * Extracts labels from an AnalyticsDataSource (uses the 'label' field of each record).
   */
  extractLabels<T extends AnalyticsRecord>(data: AnalyticsDataSource<T>): string[] {
    return data.records.map(r => String(r['label'] ?? ''));
  }

  /**
   * Resolves colors for a list of metrics.
   * Uses MetricConfig.color if defined; otherwise auto-generates from the library palette.
   *
   * @param count  - Number of colors needed
   * @param colors - Per-metric explicit colors (may be undefined entries)
   */
  resolveColors(count: number, colors: (string | undefined)[] = []): string[] {
    const palette = generatePalette(count, this.libConfig.defaultPalette);
    return Array.from({ length: count }, (_, i) => colors[i] ?? palette[i]);
  }

  /**
   * Builds common Chart.js options (responsive, animation, legend, tooltip).
   * Merged with the consumer-supplied config.options last — consumer always wins.
   * Returns ChartOptions cast to the specific chart type to satisfy Chart.js generics.
   *
   * @param config - NgxChartConfig from the chart component's @Input()
   */
  buildBaseOptions<CT extends ChartType = ChartType>(config: NgxChartConfig): ChartOptions<CT> {
    const base: ChartOptions = {
      responsive: config.responsive ?? true,
      maintainAspectRatio: true,
      animation: {
        duration: this.libConfig.animationDuration,
      },
      plugins: {
        legend: {
          display: config.showLegend ?? true,
          position: 'bottom',
        },
        title: {
          display: !!config.title,
          text: config.title,
          font: { size: 14, weight: 'bold' },
        },
      },
    };

    const merged = this.deepMergeOptions(base, config.options ?? {});
    return merged as ChartOptions<CT>;
  }

  /**
   * Simple two-level deep merge for Chart.js options objects.
   * Avoids overwriting nested plugin objects entirely.
   */
  private deepMergeOptions(base: ChartOptions, override: ChartOptions): ChartOptions {
    const result: any = { ...base };
    for (const key of Object.keys(override) as Array<keyof ChartOptions>) {
      const overrideVal = (override as any)[key];
      if (
        overrideVal &&
        typeof overrideVal === 'object' &&
        !Array.isArray(overrideVal) &&
        result[key] &&
        typeof result[key] === 'object'
      ) {
        result[key] = { ...result[key], ...overrideVal };
      } else {
        result[key] = overrideVal;
      }
    }
    return result;
  }
}
