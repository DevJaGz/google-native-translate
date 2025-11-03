import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconButton, LanguageSelector } from '@ui/components';
import { BreakpointsService } from '@ui/services';

@Component({
  selector: 'app-language-selectors',
  imports: [IconButton, LanguageSelector],
  template: `
    <div class="flex items-center gap-2 h-12 justify-center">
      <app-language-selector [handset]="breakpointsService.isHandset()" />
      <app-icon-button>swap_horiz</app-icon-button>
      <app-language-selector [handset]="breakpointsService.isHandset()" />
    </div>
  `,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectors {
  protected readonly breakpointsService = inject(BreakpointsService);
}
