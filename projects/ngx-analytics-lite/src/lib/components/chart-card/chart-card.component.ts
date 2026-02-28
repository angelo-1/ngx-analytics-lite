import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Dashboard card wrapper for any ngx-analytics-lite chart component.
 * Provides a consistent card UI with a title, optional shimmer loader,
 * and a slot for card-level action buttons.
 *
 * @example
 * <ngx-chart-card title="Monthly Revenue" [loading]="isLoading">
 *   <button card-actions (click)="refresh()">↺</button>
 *   <ngx-pie-chart [data]="data" [config]="cfg" />
 * </ngx-chart-card>
 */
@Component({
  selector: 'ngx-chart-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ngx-chart-card"
      [class.ngx-chart-card--loading]="loading"
      [attr.data-elevation]="elevation"
    >
      <div class="ngx-chart-card__header">
        <h3 class="ngx-chart-card__title">{{ title }}</h3>
        <div class="ngx-chart-card__actions">
          <ng-content select="[card-actions]" />
        </div>
      </div>

      <div class="ngx-chart-card__body">
        <!-- Shimmer skeleton shown while loading -->
        <div *ngIf="loading" class="ngx-shimmer" aria-busy="true" aria-label="Loading chart...">
          <div class="ngx-shimmer__circle"></div>
          <div class="ngx-shimmer__lines">
            <div class="ngx-shimmer__line"></div>
            <div class="ngx-shimmer__line ngx-shimmer__line--short"></div>
          </div>
        </div>
        <!-- Chart content projected here -->
        <ng-content *ngIf="!loading" />
      </div>
    </div>
  `,
  styles: [`
    .ngx-chart-card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.05);
      padding: 1.25rem;
      transition: box-shadow 0.2s ease;
    }
    .ngx-chart-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.12); }
    .ngx-chart-card[data-elevation="high"] { box-shadow: 0 8px 32px rgba(0,0,0,.14); }
    .ngx-chart-card[data-elevation="low"]  { box-shadow: none; border: 1px solid #e5e7eb; }

    .ngx-chart-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .ngx-chart-card__title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
    }
    .ngx-chart-card__actions { display: flex; gap: 0.5rem; }

    /* Shimmer */
    .ngx-shimmer { padding: 1rem 0; }
    .ngx-shimmer__circle {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: ngx-shimmer-wave 1.4s infinite;
      margin: 0 auto 1rem;
    }
    .ngx-shimmer__line {
      height: 12px; border-radius: 6px;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: ngx-shimmer-wave 1.4s infinite;
      margin-bottom: 0.5rem;
    }
    .ngx-shimmer__line--short { width: 60%; }

    @keyframes ngx-shimmer-wave {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class ChartCardComponent {
  /** Card header title — required */
  @Input({ required: true }) title!: string;
  /** When true, shows shimmer skeleton instead of chart content */
  @Input() loading = false;
  /** Shadow elevation level: 'low' | 'medium' | 'high' */
  @Input() elevation: 'low' | 'medium' | 'high' = 'medium';
}
