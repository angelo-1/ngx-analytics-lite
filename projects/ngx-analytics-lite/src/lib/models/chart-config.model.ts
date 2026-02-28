import { ChartOptions } from 'chart.js';

/**
 * Strongly-typed configuration for all ngx-analytics-lite chart components.
 * Passed via @Input() config on every chart component.
 */
export interface NgxChartConfig {
  /** Chart type — determines which Chart.js renderer is used */
  type: 'pie' | 'bar' | 'line';
  /** Optional title rendered above the chart */
  title?: string;
  /** Full Chart.js options override — merged last, giving the consumer full control */
  options?: ChartOptions;
  /** Whether to display the chart legend. Default: true */
  showLegend?: boolean;
  /** Whether the chart should resize with its container. Default: true */
  responsive?: boolean;
  /**
   * Behavior when all metric values in the dataset are zero:
   * - 'hide'        → removes the canvas entirely (default)
   * - 'placeholder' → shows EmptyStateComponent
   * - 'show'        → renders the chart anyway
   */
  zeroValueBehavior?: 'hide' | 'placeholder' | 'show';
  /** Text shown in EmptyStateComponent when zeroValueBehavior is 'placeholder' */
  placeholderText?: string;
}
