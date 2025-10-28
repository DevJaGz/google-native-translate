import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-icon-button',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      matIconButton
      [matTooltip]="tooltipText()"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel()"
    >
      <mat-icon class="text-primary!">
        <span class="material-symbols-outlined">
          <ng-content />
        </span>
      </mat-icon>
    </button>
  `,
  host: {
    'style.display': 'contents',
    '[class.large]': "size() === 'large'",
  },
  styles: `
   :host > button {
      width: calc(var(--size, 40px) * 1px);
      height: calc(var(--size, 40px) * 1px);
      display: grid;
      place-items: center;
      color: var(--color-icon-color);

      &:disabled {
        opacity: 0.5;
      }
   }

   :host.large {
     --size: 48;
   }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButton {
  isDisabled = input(false, { transform: booleanAttribute });
  ariaLabel = input('Action button');
  size = input<'small' | 'medium' | 'large'>('medium');
  tooltipText = input('');
}
