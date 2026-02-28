import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { FilterConfig } from '../models/filter-config.model';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FilterService] });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty filter', () => {
    expect(service.currentFilter).toEqual({});
  });

  it('should emit on setFilter()', (done) => {
    const filter: FilterConfig = { selectedMonths: ['2025-01'] };
    service.filter$.subscribe(f => {
      if (f.selectedMonths) {
        expect(f.selectedMonths).toEqual(['2025-01']);
        done();
      }
    });
    service.setFilter(filter);
  });

  it('should merge on setFilter()', () => {
    service.setFilter({ selectedMonths: ['2025-01'] });
    service.setFilter({ selectedMetrics: ['revenue'] });
    const current = service.currentFilter;
    expect(current.selectedMonths).toEqual(['2025-01']);
    expect(current.selectedMetrics).toEqual(['revenue']);
  });

  it('should reset to empty on resetFilter()', () => {
    service.setFilter({ selectedMonths: ['2025-01'] });
    service.resetFilter();
    expect(service.currentFilter).toEqual({});
  });

  it('should patch a single key with patchFilter()', () => {
    service.patchFilter('selectedMonths', ['2025-03']);
    expect(service.currentFilter.selectedMonths).toEqual(['2025-03']);
  });
});
