import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FilterConfig } from '../../models/filter-config.model';

/**
 * Dashboard filter bar with date-range pickers and optional month multi-select.
 * Debounces user input (300ms) and emits a FilterConfig on every meaningful change.
 *
 * Pair this with FilterService for reactive cross-component filter sync, or use
 * the (filterChange) output directly with a simple local state variable.
 *
 * @example
 * <ngx-filter-bar
 *   [availableMonths]="['2025-01','2025-02','2025-03']"
 *   (filterChange)="onFilter($event)"
 * />
 */
@Component({
  selector: 'ngx-filter-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" class="ngx-filter-bar" role="search" aria-label="Analytics filters">

      <!-- Date range -->
      <div class="ngx-filter-bar__group">
        <label for="ngxDateFrom" class="ngx-filter-bar__label">From</label>
        <input
          id="ngxDateFrom"
          type="date"
          formControlName="dateFrom"
          class="ngx-filter-bar__input"
        />
      </div>

      <div class="ngx-filter-bar__group">
        <label for="ngxDateTo" class="ngx-filter-bar__label">To</label>
        <input
          id="ngxDateTo"
          type="date"
          formControlName="dateTo"
          class="ngx-filter-bar__input"
        />
      </div>

      <!-- Month multi-select (shown only when availableMonths provided) -->
      <div class="ngx-filter-bar__group" *ngIf="availableMonths.length">
        <label for="ngxMonths" class="ngx-filter-bar__label">Months</label>
        <select
          id="ngxMonths"
          formControlName="months"
          multiple
          class="ngx-filter-bar__select"
          aria-multiselectable="true"
        >
          <option *ngFor="let m of availableMonths" [value]="m">
            {{ m + '-01' | date: 'MMM yyyy' }}
          </option>
        </select>
      </div>

      <!-- Reset button -->
      <button
        type="button"
        class="ngx-filter-bar__reset"
        (click)="reset()"
        aria-label="Reset all filters"
      >
        ✕ Reset
      </button>
    </form>
  `,
  styles: [`
    .ngx-filter-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .ngx-filter-bar__group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .ngx-filter-bar__label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ngx-filter-bar__input,
    .ngx-filter-bar__select {
      padding: 0.4rem 0.65rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #374151;
      background: #fff;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .ngx-filter-bar__input:focus,
    .ngx-filter-bar__select:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
    }
    .ngx-filter-bar__select { min-height: 80px; }
    .ngx-filter-bar__reset {
      padding: 0.42rem 0.9rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.82rem;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s ease;
      align-self: flex-end;
    }
    .ngx-filter-bar__reset:hover {
      border-color: #ef4444;
      color: #ef4444;
    }
  `],
})
export class FilterBarComponent implements OnInit, OnDestroy {
  /** Available months for the multi-select (format: 'YYYY-MM'). */
  @Input() availableMonths: string[] = [];

  /**
   * Emits a FilterConfig whenever the user changes any filter field.
   * Debounced by 300ms; only emits on distinct values.
   */
  @Output() filterChange = new EventEmitter<FilterConfig>();

  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      months: [[]],
    });

    this.form.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntil(this.destroy$)
    ).subscribe(val => this.emitFilter(val));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Reset all filter fields and emit an empty FilterConfig. */
  reset(): void {
    this.form.reset({ dateFrom: '', dateTo: '', months: [] });
    this.filterChange.emit({});
  }

  private emitFilter(val: { dateFrom: string; dateTo: string; months: string[] }): void {
    const filter: FilterConfig = {};
    if (val.dateFrom && val.dateTo) {
      filter.dateRange = { from: val.dateFrom, to: val.dateTo };
    }
    if (val.months?.length) {
      filter.selectedMonths = val.months;
    }
    this.filterChange.emit(filter);
  }
}
