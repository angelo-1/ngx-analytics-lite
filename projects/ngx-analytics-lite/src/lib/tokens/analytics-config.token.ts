import { InjectionToken } from '@angular/core';

/**
 * Library-wide configuration shape.
 * Override via providers array in your AppModule or app.config.ts.
 *
 * @example
 * // app.config.ts (standalone bootstrap)
 * providers: [
 *   {
 *     provide: ANALYTICS_CONFIG,
 *     useValue: {
 *       defaultPalette: ['#ff6384', '#36a2eb'],
 *       defaultZeroValueBehavior: 'placeholder',
 *       defaultPlaceholderText: 'No data yet',
 *       animationDuration: 600,
 *     }
 *   }
 * ]
 */
export interface AnalyticsLibConfig {
  /** Default color palette used when MetricConfig.color is not provided */
  defaultPalette: string[];
  /**
   * Global default for zero-value behavior on all chart components.
   * Can be overridden per-component via NgxChartConfig.zeroValueBehavior.
   */
  defaultZeroValueBehavior: 'hide' | 'placeholder' | 'show';
  /** Global default placeholder text for EmptyStateComponent */
  defaultPlaceholderText: string;
  /** Chart.js animation duration in milliseconds */
  animationDuration: number;
}

/** Built-in sensible defaults — consumers can partially or fully override. */
export const ANALYTICS_DEFAULT_CONFIG: AnalyticsLibConfig = {
  defaultPalette: [
    '#6366f1', '#22d3ee', '#f59e0b', '#10b981',
    '#ef4444', '#8b5cf6', '#f97316', '#06b6d4',
  ],
  defaultZeroValueBehavior: 'hide',
  defaultPlaceholderText: 'No data available for the selected period.',
  animationDuration: 400,
};

/**
 * InjectionToken for library-wide configuration.
 * Defaults to ANALYTICS_DEFAULT_CONFIG via the factory.
 */
export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsLibConfig>(
  'ANALYTICS_CONFIG',
  { providedIn: 'root', factory: () => ANALYTICS_DEFAULT_CONFIG }
);
