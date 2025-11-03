import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconButton, LanguageSelector } from '@ui/components';
import { BreakpointService } from '@ui/services';

@Component({
  selector: 'app-language-selectors',
  imports: [IconButton, LanguageSelector],
  template: `
    <div class="flex items-center gap-2 h-12 justify-center">
      <app-language-selector [handset]="breakpointService.isHandset()" />
      <app-icon-button>swap_horiz</app-icon-button>
      <app-language-selector [handset]="breakpointService.isHandset()" />
    </div>
  `,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectors {
  protected readonly breakpointService = inject(BreakpointService);
}
