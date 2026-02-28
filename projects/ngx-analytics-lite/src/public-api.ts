/*
 * Public API Surface of ngx-analytics-lite
 *
 * IMPORTANT: Only symbols exported here are part of the public API contract.
 * Do NOT export internal abstractions (BaseChartComponent, ChartRegistry, deepEquals).
 */

// ── Models ────────────────────────────────────────────────────────────────────
export * from './lib/models/analytics-data.model';
export * from './lib/models/chart-config.model';
export * from './lib/models/filter-config.model';
export * from './lib/models/chart-click-event.model';
export * from './lib/models/date-range.model';

// ── Tokens ────────────────────────────────────────────────────────────────────
export type { AnalyticsLibConfig }               from './lib/tokens/analytics-config.token';
export { ANALYTICS_CONFIG, ANALYTICS_DEFAULT_CONFIG } from './lib/tokens/analytics-config.token';

// ── Components ────────────────────────────────────────────────────────────────
export { EmptyStateComponent }       from './lib/components/empty-state/empty-state.component';
export { ChartCardComponent }        from './lib/components/chart-card/chart-card.component';
export { PieChartComponent }         from './lib/components/pie-chart/pie-chart.component';
export { BarChartComponent }         from './lib/components/bar-chart/bar-chart.component';
export { LineChartComponent }        from './lib/components/line-chart/line-chart.component';
export { AnalyticsTableComponent }   from './lib/components/analytics-table/analytics-table.component';
export { FilterBarComponent }        from './lib/components/filter-bar/filter-bar.component';

// ── Services ──────────────────────────────────────────────────────────────────
export { AnalyticsService }          from './lib/services/analytics.service';
export { FilterService }             from './lib/services/filter.service';

// ── Utils (public helpers — intentionally selective) ─────────────────────────
export { extractMonths, isInDateRange } from './lib/utils/month.utils';
export { generatePalette, hexToRgba }   from './lib/utils/color.utils';
