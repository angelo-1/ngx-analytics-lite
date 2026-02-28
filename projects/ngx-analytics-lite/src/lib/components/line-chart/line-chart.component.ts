import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
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
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);
registerSharedChartComponents();

/**
 * Chart.js Line Chart wrapper.
 * Supports multi-line datasets (one line per metric).
 * Area fill enabled by default via Chart.js Filler plugin.
 *
 * @example
 * <ngx-line-chart
 *   [data]="analyticsData"
 *   [config]="{ type: 'line', title: 'Revenue Trend' }"
 *   (chartClick)="onPointClick($event)"
 * />
 */
@Component({
  selector: 'ngx-line-chart',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ngx-line-chart-wrapper">
      <ngx-empty-state
        *ngIf="isAllZero && showPlaceholder"
        [message]="config.placeholderText ?? libConfig.defaultPlaceholderText"
        icon="📈"
      />
      <canvas
        *ngIf="!shouldHideChart"
        class="ngx-line-chart__canvas"
        role="img"
        [attr.aria-label]="config.title ?? 'Line Chart'"
      ></canvas>
    </div>
  `,
  styles: [`
    .ngx-line-chart-wrapper { position: relative; width: 100%; }
    .ngx-line-chart__canvas { max-height: 320px; }
  `],
})
export class LineChartComponent<T extends AnalyticsRecord = AnalyticsRecord>
  extends BaseChartComponent<T, 'line'> {

  private readonly configService = inject(ChartConfigService);

  protected override buildChartConfig(): ChartConfiguration<'line'> {
    const labels = this.configService.extractLabels(this.data);
    const palette = this.configService.resolveColors(
      this.data.metrics.length,
      this.data.metrics.map(m => m.color)
    );

    const datasets = this.data.metrics.map((metric, i) => ({
      label: metric.label,
      data: this.data.records.map(r => Number(r[metric.key]) || 0),
      borderColor: palette[i],
      backgroundColor: hexToRgba(palette[i], 0.15),
      borderWidth: 2.5,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    }));

    const options = this.configService.buildBaseOptions<'line'>(this.config);

    return {
      type: 'line',
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
