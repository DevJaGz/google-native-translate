import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconButton, LanguageSelectorButton } from '@ui/components';
import { BreakpointsService } from '@ui/services';

@Component({
  selector: 'app-language-selectors',
  imports: [IconButton, LanguageSelectorButton, MatButtonModule],
  template: `<div class="w-fit mx-auto">
    <div class="c-selectors flex items-center gap-8">
      <app-language-selector-button class="c-select"
        >English</app-language-selector-button
      >
      <button
        matButton
        class="c-button text-google-sky-blue">
        English
      </button>
      <app-icon-button>swap_horiz</app-icon-button>
      <app-language-selector-button class="c-select"
        >Spanish</app-language-selector-button
      >
      <button
        matButton
        class="c-button text-google-sky-blue">
        Spanish
      </button>
    </div>
  </div>`,
  styles: `
    :host .c-selectors > .c-select {
      display: none;
    }

    // :host[data-handset='false'] .c-selectors > .c-select {
    //   display: block;
    // }

    // :host[data-handset='false'] .c-selectors > .c-button {
    //   display: none;
    // }
  `,
  host: {
    '[style.display]': '"block"',
    '[attr.data-handset]': 'breakpointsService.isHandset()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectors {
  protected readonly breakpointsService = inject(BreakpointsService);
}
