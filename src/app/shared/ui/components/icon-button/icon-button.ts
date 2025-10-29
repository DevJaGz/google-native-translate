import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-icon-button',
  imports: [MatButtonModule, Icon, MatTooltipModule],
  template: `
    <button
      matIconButton
      [matTooltip]="tooltipText()"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel()"
    >
      <app-icon><ng-content /></app-icon>
    </button>
  `,
  host: {
    '[style.display]': '"block"',
    '[class.large]': "size() === 'large'",
  },
  styles: `
   :host > button {
      width: calc(var(--size, 40px) * 1px);
      height: calc(var(--size, 40px) * 1px);
      display: grid;
      place-items: center;
      color: var(--text-secondary);

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
