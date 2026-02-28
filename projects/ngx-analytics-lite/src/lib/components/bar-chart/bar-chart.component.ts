import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { CommonModule } from '@angular/common';

import { BaseChartComponent } from '../../core/base-chart.component';
import { AnalyticsRecord } from '../../models/analytics-data.model';
import { ChartConfigService } from '../../services/chart-config.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { registerSharedChartComponents } from '../../core/chart-registry';
import { hexToRgba } from '../../utils/color.utils';

// Tree-shakable Chart.js registration
Chart.register(BarController, BarElement, CategoryScale, LinearScale);
registerSharedChartComponents();

/**
 * Chart.js Bar Chart wrapper.
 * Supports multi-dataset (grouped bars) via multiple MetricConfig entries.
 *
 * @example
 * <ngx-bar-chart
 *   [data]="analyticsData"
 *   [config]="{ type: 'bar', title: 'Sales by Quarter' }"
 *   (chartClick)="onBarClick($event)"
 * />
 */
@Component({
  selector: 'ngx-bar-chart',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ngx-bar-chart-wrapper">
      <ngx-empty-state
        *ngIf="isAllZero && showPlaceholder"
        [message]="config.placeholderText ?? libConfig.defaultPlaceholderText"
        icon="📊"
      />
      <canvas
        *ngIf="!shouldHideChart"
        class="ngx-bar-chart__canvas"
        role="img"
        [attr.aria-label]="config.title ?? 'Bar Chart'"
      ></canvas>
    </div>
  `,
  styles: [`
    .ngx-bar-chart-wrapper { position: relative; width: 100%; }
    .ngx-bar-chart__canvas { max-height: 320px; }
  `],
})
export class BarChartComponent<T extends AnalyticsRecord = AnalyticsRecord>
  extends BaseChartComponent<T, 'bar'> {

  private readonly configService = inject(ChartConfigService);

  protected override buildChartConfig(): ChartConfiguration<'bar'> {
    const labels = this.configService.extractLabels(this.data);
    const palette = this.configService.resolveColors(
      this.data.metrics.length,
      this.data.metrics.map(m => m.color)
    );

    // Multi-dataset support: one dataset per metric
    const datasets = this.data.metrics.map((metric, i) => ({
      label: metric.label,
      data: this.data.records.map(r => Number(r[metric.key]) || 0),
      backgroundColor: hexToRgba(palette[i], 0.8),
      borderColor: palette[i],
      borderWidth: 1.5,
      borderRadius: 4,
      borderSkipped: false,
    }));

    const options = this.configService.buildBaseOptions<'bar'>(this.config);

    return {
      type: 'bar',
      data: { labels, datasets },
      options: {
        ...options,
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        },
      },
    };
  }
}
