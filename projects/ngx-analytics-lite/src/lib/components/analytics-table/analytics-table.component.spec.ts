import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsTableComponent } from './analytics-table.component';
import { AnalyticsDataSource } from '../../models/analytics-data.model';
import { FilterConfig } from '../../models/filter-config.model';
import { By } from '@angular/platform-browser';

const mockData: AnalyticsDataSource = {
  records: [
    { date: '2025-01-10', label: 'Product A', revenue: 5000 },
    { date: '2025-02-15', label: 'Product B', revenue: 8000 },
    { date: '2025-03-20', label: 'Product C', revenue: 3000 },
  ],
  metrics: [{ key: 'revenue', label: 'Revenue', unit: '$' }],
};

describe('AnalyticsTableComponent', () => {
  let fixture: ComponentFixture<AnalyticsTableComponent>;
  let component: AnalyticsTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('filter', {});
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show all records when no filter applied', () => {
    fixture.detectChanges();
    expect(component.filteredRecords.length).toBe(3);
  });

  it('should auto-detect 3 visible months from full data', () => {
    fixture.detectChanges();
    expect(component.visibleMonths).toEqual(['2025-01', '2025-02', '2025-03']);
  });

  it('should filter records by date range', () => {
    fixture.componentRef.setInput('filter', { dateRange: { from: '2025-01-01', to: '2025-01-31' } });
    fixture.detectChanges();
    expect(component.filteredRecords.length).toBe(1);
    expect(component.filteredRecords[0]['label']).toBe('Product A');
  });

  it('should auto-detect only 1 month after date range filter', () => {
    fixture.componentRef.setInput('filter', { dateRange: { from: '2025-01-01', to: '2025-01-31' } });
    fixture.detectChanges();
    expect(component.visibleMonths).toEqual(['2025-01']);
  });

  it('should filter records by selectedMonths', () => {
    fixture.componentRef.setInput('filter', { selectedMonths: ['2025-02', '2025-03'] });
    fixture.detectChanges();
    expect(component.filteredRecords.length).toBe(2);
  });

  it('should show empty state row when no records match', () => {
    fixture.componentRef.setInput('filter', { selectedMonths: ['2025-12'] });
    fixture.detectChanges();
    const emptyCell = fixture.debugElement.query(By.css('.ngx-table__cell--empty'));
    expect(emptyCell).toBeTruthy();
  });
});
