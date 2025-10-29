import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconButton, Logo } from '@shared/ui';
import { Store } from '@ui/store';

@Component({
  selector: 'app-sidenav',
  imports: [Logo, IconButton],
  template: `
    <aside class="p-4">
      <div class="flex justify-end">
        <app-icon-button
          (click)="store.sidenav.setIsOpen(false)"
          (keydown.enter)="store.sidenav.setIsOpen(false)"
        >
          Close
        </app-icon-button>
      </div>
      <app-logo />
      <dl class="mt-8 [&>dt]:font-semibold [&>dd+dt]:mt-2">
        <dt>Author:</dt>
        <dd>
          <a
            class="text-primary! underline"
            href="https://juliangomez.dev"
            target="_blank"
            rel="noreferrer noopener"
            >juliangomez.dev</a
          >
        </dd>
      </dl>
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
