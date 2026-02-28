import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Displayed when a chart has all-zero values and zeroValueBehavior is 'hide' or 'placeholder'.
 *
 * @example
 * <ngx-empty-state message="No data for selected period" icon="📊" />
 */
@Component({
  selector: 'ngx-empty-state',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ngx-empty-state" role="status" aria-live="polite">
      <div class="ngx-empty-state__icon" aria-hidden="true">{{ icon }}</div>
      <p class="ngx-empty-state__message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .ngx-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      text-align: center;
      color: #9ca3af;
      min-height: 120px;
    }
    .ngx-empty-state__icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
      opacity: 0.6;
    }
    .ngx-empty-state__message {
      font-size: 0.9rem;
      margin: 0;
      font-style: italic;
    }
  `],
})
export class EmptyStateComponent {
  /** Message to display below the icon */
  @Input() message = 'No data available.';
  /** Emoji or unicode icon displayed above the message */
  @Input() icon = '📭';
}
