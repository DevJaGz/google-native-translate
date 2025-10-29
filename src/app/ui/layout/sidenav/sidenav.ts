import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconButton, Logo } from '@shared/ui';
import { Store } from '@ui/store';

@Component({
  selector: 'app-sidenav',
  imports: [Logo, IconButton],
  template: `
    <aside>
      <div class="pl-4 pt-1 pr-1 pb-4 border-b border-b-border-shadow">
        <div class="flex justify-end">
          <app-icon-button
            (click)="store.sidenav.setIsOpen(false)"
            (keydown.enter)="store.sidenav.setIsOpen(false)"
          >
            Close
          </app-icon-button>
        </div>
        <app-logo />
      </div>
      <div class="p-4">
        <span>
          <strong>Author: </strong>
          <a
            class="text-primary! underline"
            href="https://juliangomez.dev"
            target="_blank"
            rel="noreferrer noopener"
            >juliangomez.dev</a
          ></span
        >
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
