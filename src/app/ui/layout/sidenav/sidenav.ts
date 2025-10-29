import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Icon, IconButton, Logo } from '@shared/ui';
import { Store } from '@ui/store';

@Component({
  selector: 'app-sidenav',
  imports: [Logo, IconButton, Icon, MatTooltip],
  template: `
    <aside class="h-full grid grid-rows-[auto_1fr]">
      <div class="pl-4 pt-1 pr-1 pb-4 border-b border-b-border-shadow">
        <div class="flex justify-end">
          <app-icon-button
            tooltipText="Close Main Menu"
            ariaLabel="Close Main Menu"
            (click)="store.sidenav.setIsOpen(false)"
            (keydown.enter)="store.sidenav.setIsOpen(false)"
          >
            Close
          </app-icon-button>
        </div>
        <app-logo />
        <p class="mb-4">
          This is an independent educational project and is not associated with, endorsed by, or
          sponsored by Google LLC or Google Translate.
        </p>
        <div class="flex gap-1 items-center flex-wrap">
          <app-icon>account_circle</app-icon>
          <div class="flex items-center gap-1">
            <strong>Author: </strong>
            <a
              matTooltip="Open in new tab"
              class="underline"
              href="https://juliangomez.dev"
              target="_blank"
              rel="noreferrer noopener"
            >
              juliangomez.dev</a
            >
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  protected readonly store = inject(Store);
}
