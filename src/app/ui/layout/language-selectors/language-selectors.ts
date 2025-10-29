import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconButton } from '@app/shared/ui';

@Component({
  selector: 'app-language-selectors',
  imports: [IconButton],
  template: `<div class="w-fit mx-auto">
    <div class="flex items-center gap-2">From <app-icon-button>swap_horiz</app-icon-button> to</div>
  </div>`,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectors {}
