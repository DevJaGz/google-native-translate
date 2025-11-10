import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';

import { Header, LanguageSelectors, OperationMode, Sidenav } from '@ui/layout';
import { Store } from '@ui/store';
import { CheckSupportUsecase } from '@core/use-cases';
import { tap } from 'rxjs';
import { SupportedBrowsersMessage } from '@ui/components';
import { SUPPORTED_BROWSERS } from '@core/constants';

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
    SupportedBrowsersMessage,
  ],
  template: `
    <mat-drawer-container
      autosize
      class="h-full [&>.mat-drawer-backdrop]:bg-transparent! bg-surface-primary! text-primary!">
      <mat-drawer
        mode="over"
        [opened]="store.sidenav.isOpen()"
        (closed)="store.patchState({ sidenav: { isOpen: false } })">
        <app-sidenav />
      </mat-drawer>
      <mat-drawer-content>
        <app-header />
        <main class="max-w-7xl mx-auto px-4 mb-4">
          @if (!store.hasBrowserSupport()) {
            <app-supported-browsers-message
              class="block mt-4 mb-12"
              [supportedBrowsers]="supportedBrowsers" />
          }
          <app-operation-mode class="mt-3 sm:mt-4" />
          <app-language-selectors class="mt-4" />
          <router-outlet />
          <div class="flex justify-end mt-8">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  readonly #checkSupportUsecase = inject(CheckSupportUsecase);
  protected readonly supportedBrowsers = inject(SUPPORTED_BROWSERS);
  protected readonly store = inject(Store);

  ngOnInit(): void {
    this.#checkSupportUsecase
      .execute()
      .pipe(
        tap({
          error: () => {
            this.store.patchState({ hasBrowserSupport: false });
          },
        }),
      )
      .subscribe();
  }
}
