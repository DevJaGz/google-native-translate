import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconButton, Logo } from '@shared/ui';
import { Store } from '@ui/store';

@Component({
  selector: 'app-header',
  imports: [IconButton, Logo],
  template: `
    <header class="flex items-center border-b border-b-border-shadow p-2">
      <app-icon-button tooltipText="Main Menu" ariaLabel="Main Menu" size="large" class="mx-1"
      (click)="store.toggleSidenav()" (keydown.enter)="store.toggleSidenav()"
      >
        Menu
      </app-icon-button>
      <app-logo />
    </header>
  `,
  styles: ``,
  host: {
    'style.display': 'contents',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly store = inject(Store);
}
