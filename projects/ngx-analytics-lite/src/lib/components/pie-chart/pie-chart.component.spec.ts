import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart.component';
import { AnalyticsDataSource } from '../../models/analytics-data.model';
import { NgxChartConfig } from '../../models/chart-config.model';

// Suppress Chart.js canvas errors in jsdom environment
const mockChart = { destroy: jasmine.createSpy(), update: jasmine.createSpy(), data: {}, getElementsAtEventForMode: () => [] };
(globalThis as any).Chart = function() { return mockChart; };
(globalThis as any).Chart.register = () => {};

const mockData: AnalyticsDataSource = {
  records: [
    { date: '2025-01-01', label: 'Electronics', revenue: 45000 },
    { date: '2025-02-01', label: 'Clothing',    revenue: 23000 },
    { date: '2025-03-01', label: 'Furniture',   revenue: 18000 },
  ],
  metrics: [{ key: 'revenue', label: 'Revenue', unit: '$' }],
};

const zeroData: AnalyticsDataSource = {
  records: [{ date: '2025-01-01', label: 'A', revenue: 0 }],
  metrics: [{ key: 'revenue', label: 'Revenue' }],
};

describe('PieChartComponent', () => {
  let fixture: ComponentFixture<PieChartComponent>;
  let component: PieChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    component.data = mockData as any;
    component.config = { type: 'pie' };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should NOT report all-zero for valid data', () => {
    fixture.detectChanges();
    expect(component.isAllZero).toBeFalse();
  });

  it('should detect all-zero values correctly', () => {
    component.data = zeroData as any;
    fixture.detectChanges();
    expect(component.isAllZero).toBeTrue();
  });

  it('should hide chart when all values are zero and behavior is "hide"', () => {
    component.data = zeroData as any;
    component.config = { type: 'pie', zeroValueBehavior: 'hide' };
    fixture.detectChanges();
    expect(component.shouldHideChart).toBeTrue();
  });

  it('should NOT hide chart when zeroValueBehavior is "show"', () => {
    component.data = zeroData as any;
    component.config = { type: 'pie', zeroValueBehavior: 'show' };
    fixture.detectChanges();
    expect(component.shouldHideChart).toBeFalse();
  });

  it('should emit ChartClickEvent with correct payload', () => {
    fixture.detectChanges();
    const emitSpy = spyOn(component.chartClick, 'emit');
    const mockMouseEvent = new MouseEvent('click');
    const event = component['buildClickEvent'](0, 'Electronics', 45000, mockMouseEvent);
    component.chartClick.emit(event);
    expect(emitSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        label: 'Electronics',
        value: 45000,
        segmentIndex: 0,
        chartType: 'pie',
      })
    );
  });
});
