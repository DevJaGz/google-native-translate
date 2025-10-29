import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Header, OperationMode, Sidenav } from '@ui/layout';
import { Store } from '@ui/store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidenav, Header, MatSidenavModule, OperationMode],
  template: `
    <mat-drawer-container
      autosize
      class="h-full [&>.mat-drawer-backdrop]:bg-transparent! bg-surface-primary! text-primary!"
    >
      <mat-drawer
        mode="over"
        [opened]="store.sidenav.isOpen()"
        (closed)="store.sidenav.setIsOpen(false)"
      >
        <app-sidenav />
      </mat-drawer>
      <mat-drawer-content>
        <app-header />
        <main class="max-w-7xl mx-auto">
          <app-operation-mode />
          <router-outlet />
        </main>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(Store);
}
