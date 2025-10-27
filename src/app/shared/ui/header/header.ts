import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButton } from '../icon-button/icon-button';

@Component({
  selector: 'app-header',
  imports: [IconButton],
  template: `
    <header class="flex border-b border-b-border-shadow p-2">
      <app-icon-button tooltipText="Main Menu" ariaLabel="Main Menu" size="large" class="mx-1"> Menu </app-icon-button>
    </header>
  `,
  styles: ``,
  host: {
    'style.display': 'contents',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}
