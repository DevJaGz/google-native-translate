import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button
      matIconButton
      [attr.disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel()"
    >
      <mat-icon>
        <span class="material-symbols-outlined">
          <ng-content />
        </span>
      </mat-icon>
    </button>
  `,
  host: {
    'style.display': 'contents'
  },
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButton {
  isDisabled = input(false, { transform: booleanAttribute });
  ariaLabel = input('Action button');
}
