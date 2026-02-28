import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterConfig } from '../models/filter-config.model';

/**
 * Reactive filter state service using BehaviorSubject.
 * Allows FilterBarComponent and consuming components to stay in sync
 * without prop drilling or direct component coupling.
 *
 * Inject this at a shared ancestor component or in a feature-level provider.
 *
 * @example
 * // Provide at dashboard component level:
 * @Component({ providers: [FilterService] })
 * export class DashboardComponent { ... }
 *
 * @example
 * // Subscribe in a sibling component:
 * filterService.filter$.subscribe(f => this.activeFilter = f);
 */
@Injectable({ providedIn: null })
export class FilterService {

  private _filter$ = new BehaviorSubject<FilterConfig>({});

  /** Observable stream of the current active filter state. */
  readonly filter$: Observable<FilterConfig> = this._filter$.asObservable();

  /** Synchronously read the current filter without subscribing. */
  get currentFilter(): FilterConfig {
    return this._filter$.getValue();
  }

  /**
   * Updates the active filter. Emits the new value to all subscribers.
   * Partial updates: merges with the existing filter state.
   *
   * @param filter - Partial or full FilterConfig
   */
  setFilter(filter: FilterConfig): void {
    this._filter$.next({ ...this.currentFilter, ...filter });
  }

  /**
   * Resets filter to an empty state, effectively removing all active filters.
   */
  resetFilter(): void {
    this._filter$.next({});
  }

  /**
   * Merges a single property into the existing filter.
   *
   * @param key   - FilterConfig key to update
   * @param value - New value for the key
   */
  patchFilter<K extends keyof FilterConfig>(key: K, value: FilterConfig[K]): void {
    this._filter$.next({ ...this.currentFilter, [key]: value });
  }
}
