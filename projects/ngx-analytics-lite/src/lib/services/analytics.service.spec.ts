import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';
import { AnalyticsDataSource } from '../models/analytics-data.model';
import { FilterConfig } from '../models/filter-config.model';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockData: AnalyticsDataSource = {
    records: [
      { date: '2025-01-10', label: 'Product A', revenue: 5000, units: 50 },
      { date: '2025-02-15', label: 'Product B', revenue: 8000, units: 80 },
      { date: '2025-03-20', label: 'Product C', revenue: 3000, units: 30 },
    ],
    metrics: [
      { key: 'revenue', label: 'Revenue', unit: '$' },
      { key: 'units',   label: 'Units Sold' },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AnalyticsService] });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all records when filter is empty', (done) => {
    service.getFilteredData(mockData, {}).subscribe(result => {
      expect(result.records.length).toBe(3);
      done();
    });
  });

  it('should filter by date range', (done) => {
    const filter: FilterConfig = {
      dateRange: { from: '2025-01-01', to: '2025-01-31' },
    };
    service.getFilteredData(mockData, filter).subscribe(result => {
      expect(result.records.length).toBe(1);
      expect(result.records[0]['label']).toBe('Product A');
      done();
    });
  });

  it('should filter by selectedMonths', (done) => {
    const filter: FilterConfig = { selectedMonths: ['2025-02', '2025-03'] };
    service.getFilteredData(mockData, filter).subscribe(result => {
      expect(result.records.length).toBe(2);
      done();
    });
  });

  it('should filter metrics by selectedMetrics', (done) => {
    const filter: FilterConfig = { selectedMetrics: ['revenue'] };
    service.getFilteredData(mockData, filter).subscribe(result => {
      expect(result.metrics.length).toBe(1);
      expect(result.metrics[0].key).toBe('revenue');
      done();
    });
  });

  it('should compute total for a metric', () => {
    const total = service.getTotalForMetric(mockData, 'revenue');
    expect(total).toBe(16000);
  });

  it('should detect non-zero data', () => {
    expect(service.isAllZero(mockData)).toBeFalse();
  });

  it('should detect all-zero data', () => {
    const zeroData: AnalyticsDataSource = {
      records: [{ date: '2025-01-01', label: 'A', revenue: 0 }],
      metrics: [{ key: 'revenue', label: 'Revenue' }],
    };
    expect(service.isAllZero(zeroData)).toBeTrue();
  });
});
