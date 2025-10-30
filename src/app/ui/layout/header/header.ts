import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconButton, Logo } from '@ui/components';
import { Store } from '@ui/store';

@Component({
  selector: 'app-header',
  imports: [IconButton, Logo],
  template: `
    <header class="flex items-center border-b border-b-border-shadow p-2">
      <app-icon-button tooltipText="Main Menu" ariaLabel="Main Menu" size="large" class="mx-1"
      (click)="store.sidenav.toggle()" (keydown.enter)="store.sidenav.toggle()"
      >
        Menu
      </app-icon-button>
      <app-logo />
    </header>
  `,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly store = inject(Store);
}
