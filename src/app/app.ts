import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Header } from '@ui/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MatSidenavModule],
  template: `
    <mat-drawer-container autosize class="h-full [&>.mat-drawer-backdrop]:bg-transparent! bg-surface-primary! text-primary!">
      <mat-drawer mode="over"> Sidenav content! </mat-drawer>
      <mat-drawer-content >
        <app-header />
        <router-outlet></router-outlet>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
