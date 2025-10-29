import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Icon, IconButton, Logo } from '@shared/ui';
import { Store } from '@ui/store';

@Component({
  selector: 'app-sidenav',
  imports: [Logo, IconButton, Icon, MatTooltip],
  template: `
    <aside>
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
      </div>
      <div class="p-4">
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
    'style.display': 'contents',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidenav {
  protected readonly store = inject(Store);
}
