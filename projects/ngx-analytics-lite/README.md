# ngx-analytics-lite

[![npm version](https://img.shields.io/npm/v/ngx-analytics-lite.svg?style=flat-square)](https://www.npmjs.com/package/ngx-analytics-lite)
[![CI](https://github.com/YOUR_USERNAME/ngx-analytics-lite/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/ngx-analytics-lite/actions)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/ngx-analytics-lite/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/ngx-analytics-lite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-17%2B-red.svg)](https://angular.dev)
[![Chart.js](https://img.shields.io/badge/Chart.js-4%2B-pink.svg)](https://www.chartjs.org)

> **Enterprise-ready Angular Analytics & Chart Wrapper Library** built on top of [Chart.js](https://www.chartjs.org).
> Standalone-first · OnPush · Fully typed · Tree-shakable.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 📊 **Chart Wrappers** | Pie, Bar, and Line charts with full Chart.js config override |
| 📅 **Auto Month Filtering** | Table headers show only months present in your filtered data |
| 🖱️ **Click Navigation** | `ChartClickEvent` with label, value, rawRecord, and MouseEvent |
| ⚡ **Smart Refresh** | In-place dataset updates — no chart flicker on data changes |
| 🚫 **Zero-Value Handling** | Configurable `hide` / `placeholder` / `show` behavior |
| 🃏 **Dashboard Components** | `ChartCard` (shimmer loader), `FilterBar`, `AnalyticsTable` |
| 💪 **Angular 17+ Standalone** | No NgModule required; fully tree-shakable |
| 🔧 **Global Config Override** | `ANALYTICS_CONFIG` InjectionToken for app-wide defaults |

---

## 📦 Installation

```bash
npm install ngx-analytics-lite chart.js
```

> **Peer Dependencies:** `@angular/core >=17`, `@angular/common >=17`, `@angular/forms >=17`, `chart.js >=4`, `rxjs >=7`

---

## 🚀 Quick Start

```typescript
// app.component.ts
import { Component } from '@angular/core';
import {
  PieChartComponent,
  ChartCardComponent,
  AnalyticsDataSource,
  NgxChartConfig,
  ChartClickEvent
} from 'ngx-analytics-lite';

@Component({
  standalone: true,
  imports: [PieChartComponent, ChartCardComponent],
  template: `
    <ngx-chart-card title="Revenue by Category" [loading]="isLoading">
      <ngx-pie-chart
        [data]="analyticsData"
        [config]="pieConfig"
        (chartClick)="onSegmentClick($event)"
      />
    </ngx-chart-card>
  `
})
export class AppComponent {
  isLoading = false;

  analyticsData: AnalyticsDataSource = {
    records: [
      { date: '2025-01-01', label: 'Electronics', revenue: 45000 },
      { date: '2025-02-01', label: 'Clothing',    revenue: 23000 },
      { date: '2025-03-01', label: 'Furniture',   revenue: 18000 },
    ],
    metrics: [{ key: 'revenue', label: 'Revenue', unit: '$' }],
  };

  pieConfig: NgxChartConfig = {
    type: 'pie',
    title: 'Revenue by Category',
    showLegend: true,
    zeroValueBehavior: 'hide',
  };

  onSegmentClick(event: ChartClickEvent): void {
    console.log(`Clicked: ${event.label} — $${event.value}`);
    // this.router.navigate(['/detail', event.label]);
  }
}
```

---

## 🧩 Full Dashboard Example

```typescript
import { Component } from '@angular/core';
import {
  ChartCardComponent, PieChartComponent, BarChartComponent,
  AnalyticsTableComponent, FilterBarComponent,
  AnalyticsDataSource, FilterConfig, NgxChartConfig,
  ChartClickEvent
} from 'ngx-analytics-lite';

@Component({
  standalone: true,
  imports: [
    ChartCardComponent, PieChartComponent, BarChartComponent,
    AnalyticsTableComponent, FilterBarComponent
  ],
  template: `
    <!-- Filter Bar -->
    <ngx-filter-bar
      [availableMonths]="['2025-01','2025-02','2025-03']"
      (filterChange)="activeFilter = $event"
    />

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      <!-- Pie Chart Card -->
      <ngx-chart-card title="Revenue Split">
        <ngx-pie-chart
          [data]="data"
          [config]="{ type: 'pie', showLegend: true }"
          (chartClick)="onChartClick($event)"
        />
      </ngx-chart-card>

      <!-- Bar Chart Card -->
      <ngx-chart-card title="Monthly Revenue">
        <ngx-bar-chart
          [data]="data"
          [config]="{ type: 'bar', title: 'Revenue vs Units' }"
        />
      </ngx-chart-card>
    </div>

    <!-- Smart Analytics Table -->
    <ngx-analytics-table [data]="data" [filter]="activeFilter" />
  `,
})
export class DashboardComponent {
  activeFilter: FilterConfig = {};

  data: AnalyticsDataSource = {
    records: [
      { date: '2025-01-10', label: 'Q1 Jan', revenue: 5000, units: 50 },
      { date: '2025-02-15', label: 'Q1 Feb', revenue: 8000, units: 80 },
      { date: '2025-03-20', label: 'Q1 Mar', revenue: 3000, units: 30 },
    ],
    metrics: [
      { key: 'revenue', label: 'Revenue', unit: '$', color: '#6366f1' },
      { key: 'units',   label: 'Units Sold', color: '#22d3ee' },
    ],
  };

  onChartClick(event: ChartClickEvent): void {
    console.log(event);
  }
}
```

---

## 🌐 Global Configuration

Override library defaults via `ANALYTICS_CONFIG` — in your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { ANALYTICS_CONFIG } from 'ngx-analytics-lite';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ANALYTICS_CONFIG,
      useValue: {
        defaultPalette: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
        defaultZeroValueBehavior: 'placeholder',
        defaultPlaceholderText: 'No data for the selected period.',
        animationDuration: 600,
      }
    }
  ]
};
```

---

## 📖 API Reference

### `<ngx-pie-chart>`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `AnalyticsDataSource` | **required** | Data source |
| `config` | `NgxChartConfig` | `{ type: 'pie' }` | Chart configuration |

| Output | Payload | Description |
|--------|---------|-------------|
| `chartClick` | `ChartClickEvent` | Emits when a pie slice is clicked |

### `<ngx-bar-chart>`

Same inputs/outputs as `ngx-pie-chart`. Supports **multi-dataset** (one bar group per `MetricConfig`).

### `<ngx-line-chart>`

Same inputs/outputs as `ngx-pie-chart`. Supports **multi-line** with area fill.

### `<ngx-analytics-table>`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `AnalyticsDataSource` | **required** | Data source |
| `filter` | `FilterConfig` | `{}` | Active filter state |

Auto-detects and renders only month columns present in the **filtered** dataset.

### `<ngx-filter-bar>`

| Input | Type | Description |
|-------|------|-------------|
| `availableMonths` | `string[]` | Months to show in multi-select (`'YYYY-MM'` format) |

| Output | Payload | Description |
|--------|---------|-------------|
| `filterChange` | `FilterConfig` | Emits debounced filter on every change |

### `<ngx-chart-card>`

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | **required** | Card header title |
| `loading` | `boolean` | `false` | Shows shimmer skeleton when true |
| `elevation` | `'low' \| 'medium' \| 'high'` | `'medium'` | Card shadow level |

Slots: `[card-actions]` — projected into the card header.

### `NgxChartConfig`

```typescript
interface NgxChartConfig {
  type: 'pie' | 'bar' | 'line';
  title?: string;
  options?: ChartOptions;        // Full Chart.js options — merged last (consumer wins)
  showLegend?: boolean;          // Default: true
  responsive?: boolean;          // Default: true
  zeroValueBehavior?: 'hide' | 'placeholder' | 'show'; // Default: 'hide'
  placeholderText?: string;
}
```

### `ChartClickEvent<T>`

```typescript
interface ChartClickEvent<T extends AnalyticsRecord = AnalyticsRecord> {
  chartType: 'pie' | 'bar' | 'line';
  segmentIndex: number;
  label: string;
  value: number;
  rawRecord?: T;           // The original AnalyticsRecord for this segment
  nativeEvent: MouseEvent;
}
```

### `FilterConfig`

```typescript
interface FilterConfig {
  dateRange?: { from: Date | string; to: Date | string; };
  selectedMonths?: string[];  // 'YYYY-MM' format
  selectedMetrics?: string[]; // metric keys
}
```

---

## 🛠 Services

### `AnalyticsService`

```typescript
// Provide in your component or AppModule
providers: [AnalyticsService]

// Usage
constructor(private analytics: AnalyticsService) {}

this.analytics.getFilteredData(rawData, filter).subscribe(filtered => ...);
this.analytics.getTotalForMetric(data, 'revenue'); // → number
this.analytics.isAllZero(data);                    // → boolean
```

### `FilterService`

```typescript
// Provide at a shared ancestor component for cross-component filter sync
providers: [FilterService]

// Usage
filterService.setFilter({ dateRange: { from, to } });
filterService.patchFilter('selectedMonths', ['2025-01']);
filterService.filter$.pipe(takeUntilDestroyed()).subscribe(f => ...);
filterService.resetFilter();
```

---

## 📋 Utilities

```typescript
import { extractMonths, isInDateRange, generatePalette, hexToRgba } from 'ngx-analytics-lite';

// Extract unique sorted months from ISO date strings
extractMonths(['2025-03-10', '2025-01-05']); // → ['2025-01', '2025-03']

// Check if a date falls in range
isInDateRange('2025-06-15', '2025-01-01', '2025-12-31'); // → true

// Generate a color palette
generatePalette(5);                        // → ['#6366f1', '#22d3ee', ...]
generatePalette(3, ['#red','#blue']);      // → ['#red', '#blue', '#red']

// Hex to RGBA
hexToRgba('#6366f1', 0.5);                // → 'rgba(99, 102, 241, 0.5)'
```

---

## 🚢 Publishing

```bash
# Build for production
npm run build:lib

# Bump version (creates git tag)
npm version minor   # 1.0.0 → 1.1.0
npm version patch   # 1.0.0 → 1.0.1
npm version major   # 1.0.0 → 2.0.0

# Publish to npm
cd dist/ngx-analytics-lite && npm publish --access public
```

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

```bash
git clone https://github.com/YOUR_USERNAME/ngx-analytics-lite
npm install
npm run build:lib -- --watch
npm run test:lib
```

---

## 📄 License

[MIT](./LICENSE) © 2026 Your Name
