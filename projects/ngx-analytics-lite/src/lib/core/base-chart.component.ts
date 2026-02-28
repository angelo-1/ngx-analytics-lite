import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { Subject } from 'rxjs';

import { AnalyticsDataSource, AnalyticsRecord } from '../models/analytics-data.model';
import { NgxChartConfig } from '../models/chart-config.model';
import { ChartClickEvent } from '../models/chart-click-event.model';
import { ANALYTICS_CONFIG } from '../tokens/analytics-config.token';
import { deepEquals } from '../utils/deep-equals.utils';

/**
 * Abstract base class for all ngx-analytics-lite chart components.
 *
 * Responsibilities:
 * - Manages Chart.js lifecycle (init, update, destroy)
 * - Implements smart refresh: updates data in-place without destroy/recreate
 * - Handles zero-value detection and hide/placeholder/show behavior
 * - Attaches click handler and emits strongly-typed ChartClickEvent
 * - Reads library-wide config via ANALYTICS_CONFIG injection token
 *
 * Concrete chart classes (Pie, Bar, Line) extend this and implement
 * only the `buildChartConfig()` method.
 *
 * @abstract
 * @internal - Not exported in public-api.ts. Use concrete chart components.
 */
@Directive()
export abstract class BaseChartComponent<
  T extends AnalyticsRecord = AnalyticsRecord,
  CT extends ChartType = ChartType
> implements AfterViewInit, OnChanges, OnDestroy {

  /** The analytics data source. Changing this triggers smart refresh. */
  @Input({ required: true }) data!: AnalyticsDataSource<T>;

  /** Chart display configuration. Config changes trigger full chart recreate. */
  @Input() config: NgxChartConfig = { type: 'bar' };

  /**
   * Emits when a chart element (slice, bar, point) is clicked.
   * Payload includes label, value, segmentIndex, rawRecord, and the native event.
   */
  @Output() chartClick = new EventEmitter<ChartClickEvent<T>>();

  /** The active Chart.js instance. Null when chart is hidden or not yet initialized. */
  protected chart: Chart | null = null;

  /** Subject used to clean up RxJS subscriptions on destroy. */
  protected destroy$ = new Subject<void>();

  /** Library-wide config injected via InjectionToken. */
  protected readonly libConfig = inject(ANALYTICS_CONFIG);

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly el = inject(ElementRef);

  /** Snapshot of previous data used for smart refresh diffing. */
  private _previousData: AnalyticsDataSource<T> | null = null;

  // ─── Computed Properties ─────────────────────────────────────────────────────

  /**
   * Returns true if every metric value across all records sums to zero.
   * Triggers zero-value behavior logic in shouldHideChart.
   */
  get isAllZero(): boolean {
    if (!this.data?.records?.length) return true;
    return this.data.metrics.every(m =>
      this.data.records.reduce((sum, r) => sum + (Number(r[m.key]) || 0), 0) === 0
    );
  }

  /**
   * Returns true if the chart canvas should not be rendered.
   * Controlled by NgxChartConfig.zeroValueBehavior and the library config default.
   */
  get shouldHideChart(): boolean {
    const behavior =
      this.config.zeroValueBehavior ?? this.libConfig.defaultZeroValueBehavior;
    return this.isAllZero && behavior !== 'show';
  }

  /**
   * Returns true if EmptyStateComponent should be shown instead of the chart.
   */
  get showPlaceholder(): boolean {
    const behavior =
      this.config.zeroValueBehavior ?? this.libConfig.defaultZeroValueBehavior;
    return this.isAllZero && behavior === 'placeholder';
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const configChanged = !!changes['config'];
    const dataChanged =
      !!changes['data'] && (!this._previousData || !deepEquals(changes['data'].currentValue, this._previousData));

    if (configChanged) {
      // Configuration change: recreate chart (rare, acceptable cost)
      this.destroyChart();
      this.initChart();
    } else if (dataChanged) {
      // Data-only change: smart in-place refresh
      this.smartRefresh();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyChart();
  }

  // ─── Abstract & Overridable ──────────────────────────────────────────────────

  /**
   * Concrete subclasses must implement this method.
   * Returns a complete Chart.js ChartConfiguration built from this.data and this.config.
   */
  protected abstract buildChartConfig(): ChartConfiguration<CT>;

  /**
   * Builds the ChartClickEvent payload.
   * Override in subclasses to add chart-type-specific data to the event.
   */
  protected buildClickEvent(
    index: number,
    label: string,
    value: number,
    nativeEvent: MouseEvent
  ): ChartClickEvent<T> {
    return {
      chartType: this.config.type as ChartClickEvent['chartType'],
      segmentIndex: index,
      label,
      value,
      rawRecord: this.data?.records?.[index],
      nativeEvent,
    };
  }

  // ─── Private ─────────────────────────────────────────────────────────────────

  private initChart(): void {
    if (this.shouldHideChart) return;

    const canvas: HTMLCanvasElement | null =
      this.el.nativeElement.querySelector('canvas');
    if (!canvas) return;

    const cfg = this.buildChartConfig();
    // Cast needed: Chart.js has a known type variance limitation with generic CT in _DeepPartialObject.
    // Runtime behavior is fully correct — the concrete chart type is always known at call site.
    this.chart = new Chart(canvas, cfg as any);
    this._previousData = structuredClone(this.data);
    this.attachClickHandler(canvas);
    this.cdr.markForCheck();
  }

  /**
   * Smart refresh: updates Chart.js datasets in-place with animation.
   * Avoids the visual flicker of destroy + recreate.
   * Falls back to full recreate if the chart should now be hidden.
   */
  private smartRefresh(): void {
    if (this.shouldHideChart) {
      this.destroyChart();
      this.cdr.markForCheck();
      return;
    }

    if (!this.chart) {
      this.initChart();
      return;
    }

    const cfg = this.buildChartConfig();
    this.chart.data = cfg.data;
    this.chart.update('active'); // 'active' triggers smooth animation
    this._previousData = structuredClone(this.data);
    this.cdr.markForCheck();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private attachClickHandler(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('click', (event: MouseEvent) => {
      if (!this.chart) return;
      const elements = this.chart.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false
      );
      if (!elements.length) return;

      const { index } = elements[0];
      const label = String(this.chart.data.labels?.[index] ?? '');
      const value = Number(
        (this.chart.data.datasets[0]?.data as number[])?.[index] ?? 0
      );
      this.chartClick.emit(this.buildClickEvent(index, label, value, event));
    });
  }
}
