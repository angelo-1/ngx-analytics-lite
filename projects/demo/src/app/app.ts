import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartCardComponent,
  PieChartComponent,
  BarChartComponent,
  LineChartComponent,
  AnalyticsTableComponent,
  FilterBarComponent,
  AnalyticsDataSource,
  FilterConfig,
  ChartClickEvent
} from 'ngx-analytics-lite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChartCardComponent,
    PieChartComponent,
    BarChartComponent,
    LineChartComponent,
    AnalyticsTableComponent,
    FilterBarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="demo-dashboard">
      <header class="dashboard-header">
        <h1>ngx-analytics-lite <span>Enterprise Dashboard</span></h1>
        <p>A production-ready Angular analytics showcase</p>
      </header>

      <!-- Advanced Filter Bar -->
      <section class="filter-section">
        <ngx-filter-bar
          [availableMonths]="['2025-01', '2025-02', '2025-03', '2025-04']"
          (filterChange)="onFilterChange($event)"
        />
      </section>

      <!-- Charts Grid -->
      <section class="charts-grid">
        <ngx-chart-card title="Revenue Split" elevation="high">
          <ngx-pie-chart
            [data]="data"
            [config]="{ type: 'pie', title: 'By Category' }"
            (chartClick)="onChartClick($event)"
          />
        </ngx-chart-card>

        <ngx-chart-card title="Monthly Sales & Units" elevation="high">
          <ngx-bar-chart
            [data]="data"
            [config]="{ type: 'bar' }"
          />
        </ngx-chart-card>

        <ngx-chart-card title="Revenue Growth Trend" elevation="high" class="full-width">
          <ngx-line-chart
            [data]="data"
            [config]="{ type: 'line', title: 'Revenue Area' }"
          />
        </ngx-chart-card>
      </section>

      <!-- Smart Analytics Table -->
      <section class="table-section">
        <div class="table-header">
          <h2>Data Breakdown</h2>
          <span class="badge">Auto-adapting Columns</span>
        </div>
        <ngx-analytics-table [data]="tableData" [filter]="activeFilter" />
      </section>
      
      <!-- Click Inspector (For Demo Purposes) -->
      <div class="click-inspector" *ngIf="lastClick">
        <strong>Last Interaction:</strong> 
        {{ lastClick.chartType | uppercase }} Chart — {{ lastClick.label }}: {{ lastClick.value | number }}
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: radial-gradient(circle at top left, #1e1e2f, #12121c);
      color: #e2e8f0;
      font-family: 'Inter', system-ui, sans-serif;
      padding: 2rem;
    }

    .demo-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }

    .dashboard-header h1 span {
      color: #6366f1;
    }

    .dashboard-header p {
      color: #94a3b8;
      font-size: 1.125rem;
      margin: 0;
    }

    .filter-section {
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
      backdrop-filter: blur(10px);
    }
    
    /* Target the inner filter bar to override its generic light theme for our dark demo */
    ::ng-deep .ngx-filter-bar {
      background: transparent !important;
      border: none !important;
      margin-bottom: 0 !important;
    }
    ::ng-deep .ngx-filter-bar__label { color: #cbd5e1 !important; }
    ::ng-deep .ngx-filter-bar__input, ::ng-deep .ngx-filter-bar__select {
      background: rgba(0, 0, 0, 0.2) !important;
      color: #fff !important;
      border-color: rgba(255, 255, 255, 0.2) !important;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }
    
    /* Customize the generic chart card for a premium look */
    ::ng-deep .ngx-chart-card {
      background: rgba(255, 255, 255, 0.03) !important;
      border: 1px solid rgba(255, 255, 255, 0.08) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
      backdrop-filter: blur(8px);
    }
    ::ng-deep .ngx-chart-card__title { color: #f8fafc !important; }
    ::ng-deep .ngx-chart-card__header { border-bottom-color: rgba(255, 255, 255, 0.08) !important; }

    .table-section {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 4rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.2);
    }

    .table-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .badge {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      padding: 0.25rem 0.75rem;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }

    /* Style the table for dark mode */
    ::ng-deep .ngx-table-container { border: none !important; }
    ::ng-deep .ngx-table__header { background: rgba(0, 0, 0, 0.1) !important; color: #94a3b8 !important; border-bottom-color: rgba(255,255,255,0.05) !important; }
    ::ng-deep .ngx-table__cell { color: #e2e8f0 !important; border-bottom-color: rgba(255,255,255,0.05) !important; }
    ::ng-deep .ngx-table__cell--label { color: #fff !important; }
    ::ng-deep .ngx-table__row:hover { background: rgba(255, 255, 255, 0.02) !important; }

    .click-inspector {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #6366f1;
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class App {
  activeFilter: FilterConfig = {};
  lastClick: ChartClickEvent | null = null;

  // Chart Data (Aggregated by Category)
  data: AnalyticsDataSource = {
    records: [
      { date: '2025-01-01', label: 'Software',   revenue: 85000, units: 120 },
      { date: '2025-02-01', label: 'Hardware',   revenue: 62000, units: 45 },
      { date: '2025-03-01', label: 'Services',   revenue: 41000, units: 85 },
      { date: '2025-04-01', label: 'Consulting', revenue: 28000, units: 15 },
    ],
    metrics: [
      { key: 'revenue', label: 'Revenue', unit: '$', color: '#6366f1' }, // Indigo
      { key: 'units',   label: 'Units Sold', color: '#10b981' },         // Emerald
    ],
  };

  // Table Data (Time-series breakdown)
  tableData: AnalyticsDataSource = {
    records: [
      { date: '2025-01-10', label: 'License Renewals', revenue: 45000, units: 80 },
      { date: '2025-01-22', label: 'New Contracts',    revenue: 40000, units: 40 },
      { date: '2025-02-05', label: 'Server Setup',     revenue: 30000, units: 10 },
      { date: '2025-02-18', label: 'Laptop Fleet',     revenue: 32000, units: 35 },
      { date: '2025-03-12', label: 'Cloud Migration',  revenue: 41000, units: 85 },
      { date: '2025-04-02', label: 'Audit Services',   revenue: 28000, units: 15 },
    ],
    metrics: [
      { key: 'revenue', label: 'Revenue', unit: '$' },
      { key: 'units',   label: 'Units' },
    ]
  };

  onFilterChange(filter: FilterConfig): void {
    this.activeFilter = filter;
  }

  onChartClick(event: ChartClickEvent): void {
    this.lastClick = event;
    // Auto-hide the popup after 3 seconds
    setTimeout(() => { if (this.lastClick === event) this.lastClick = null; }, 3000);
  }
}
