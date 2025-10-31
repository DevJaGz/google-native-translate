import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';

import { provideLanguages } from '@core/ports';
import { Header, LanguageSelectors, OperationMode, Sidenav } from '@ui/layout';
import { Store } from '@ui/store';
import { InMemoryLanguagesRepository } from '@data/repositories';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Sidenav,
    Header,
    MatSidenavModule,
    OperationMode,
    LanguageSelectors,
    MatTooltip,
  ],
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
          <app-operation-mode class="mt-4" />
          <app-language-selectors class="mt-4" />
          <router-outlet />
          <div class="flex justify-end">
            <a
              matTooltip="Open in new tab"
              class="italic hover:underline transition-transform cursor-pointer text-xs"
              href="https://github.com/DevJaGz/google-native-translate"
              target="_blank"
              rel="noreferrer noopener"
              >Send feedback</a
            >
          </div>
        </main>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
  styles: [],
  providers: [provideLanguages(InMemoryLanguagesRepository)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(Store);
}
