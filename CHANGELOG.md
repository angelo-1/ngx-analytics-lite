# Changelog

All notable changes to `ngx-analytics-lite` are documented here.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.0.0] - 2026-02-27

### Added
- `PieChartComponent` — Chart.js pie chart wrapper with click-to-navigate (ChartClickEvent)
- `BarChartComponent` — Multi-dataset grouped bar chart with rounded bars
- `LineChartComponent` — Multi-line chart with area fill support
- `AnalyticsTableComponent` — Auto month-column detection; date-range + month filtering
- `FilterBarComponent` — Date-range pickers + month multi-select with 300ms debounce
- `ChartCardComponent` — Dashboard card wrapper with shimmer loading skeleton
- `EmptyStateComponent` — Zero-value placeholder with configurable icon and message
- `BaseChartComponent` (abstract) — Smart refresh via deepEquals diffing; zero-value detection; click handler
- `AnalyticsService` — Observable-based data filtering (date range, months, metrics)
- `FilterService` — Reactive BehaviorSubject-based cross-component filter state
- `ChartConfigService` — Shared Chart.js options builder with deep merge
- `ANALYTICS_CONFIG` InjectionToken — Library-wide config override support
- Full TypeScript generics on all components and services
- OnPush change detection across all components
- Standalone components — no NgModule needed
- `"sideEffects": false` — fully tree-shakable
- Unit tests for all services and utilities
- GitHub Actions CI (Node 20 + 22) and automated npm release workflow
- MIT License, CONTRIBUTING.md, issue templates, PR template
