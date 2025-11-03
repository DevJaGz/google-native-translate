import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButton, LanguageSelectorButton } from '@ui/components';


@Component({
  selector: 'app-language-selectors',
  imports: [IconButton, LanguageSelectorButton],
  template: `<div class="w-fit mx-auto">
    <div class="flex items-center gap-8">
      <app-language-selector-button>English</app-language-selector-button>
      <app-icon-button>swap_horiz</app-icon-button>
      <app-language-selector-button>Spanish</app-language-selector-button>
    </div>
  </div>`,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectors {}
