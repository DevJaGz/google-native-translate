import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Header, Sidenav } from '@ui/layout';
import { Store } from '@ui/store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, Header, MatSidenavModule],
  template: `
    <mat-drawer-container
      autosize
      class="h-full [&>.mat-drawer-backdrop]:bg-transparent! bg-surface-primary! text-primary!"
    >
      <mat-drawer
        [opened]="store.sidenav.isOpen()"
        mode="over"
        (closed)="store.sidenav.setIsOpen(false)"
      >
        <app-sidenav />
      </mat-drawer>
      <mat-drawer-content>
        <app-header />
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(Store);
}
