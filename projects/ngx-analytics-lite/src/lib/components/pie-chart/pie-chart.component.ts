import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ArcElement,
  PieController,
} from 'chart.js';
import { CommonModule } from '@angular/common';

import { BaseChartComponent } from '../../core/base-chart.component';
import { AnalyticsRecord } from '../../models/analytics-data.model';
import { ChartConfigService } from '../../services/chart-config.service';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { registerSharedChartComponents } from '../../core/chart-registry';

// Tree-shakable Chart.js registration — only Pie-needed pieces
Chart.register(PieController, ArcElement);
registerSharedChartComponents();

/**
 * Chart.js Pie Chart wrapper with click-to-navigate support.
 *
 * Extends BaseChartComponent for smart refresh, zero-value handling,
 * and standardized ChartClickEvent emission.
 *
 * @example
 * <ngx-pie-chart
 *   [data]="analyticsData"
 *   [config]="{ type: 'pie', title: 'Revenue by Category', showLegend: true }"
 *   (chartClick)="onSegmentClick($event)"
 * />
 */
@Component({
  selector: 'ngx-pie-chart',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ngx-pie-chart-wrapper">
      <ngx-empty-state
        *ngIf="isAllZero && showPlaceholder"
        [message]="config.placeholderText ?? libConfig.defaultPlaceholderText"
        icon="🥧"
      />
      <canvas
        [style.display]="shouldHideChart ? 'none' : 'block'"
        class="ngx-pie-chart__canvas"
        role="img"
        [attr.aria-label]="config.title ?? 'Pie Chart'"
      ></canvas>
    </div>
  `,
  styles: [`
    .ngx-pie-chart-wrapper { position: relative; width: 100%; }
    .ngx-pie-chart__canvas { max-height: 320px; }
  `],
})
export class PieChartComponent<T extends AnalyticsRecord = AnalyticsRecord>
  extends BaseChartComponent<T, 'pie'> {

  private readonly configService = inject(ChartConfigService);

  protected override buildChartConfig(): ChartConfiguration<'pie'> {
    const labels = this.configService.extractLabels(this.data);
    const colors = this.configService.resolveColors(
      this.data.records.length,
      this.data.metrics.map(m => m.color)
    );

    return {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: this.data.metrics[0]?.label ?? 'Value',
          data: this.data.records.map(r =>
            Number(r[this.data.metrics[0]?.key]) || 0
          ),
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6,
        }],
      },
      options: this.configService.buildBaseOptions<'pie'>(this.config),
    };
  }
}
