import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Language } from '@core/models';
import { ListLanguagesUsecase } from '@core/use-cases';
import { IconButton, LanguageSelector } from '@ui/components';
import { BreakpointService } from '@ui/services';
import { Store } from '@ui/store';

@Component({
  selector: 'app-language-selectors',
  imports: [IconButton, LanguageSelector],
  template: `
    <div class="flex items-center gap-2 h-12 justify-center">
      <app-language-selector
        [handset]="breakpointService.isHandset()"
        [list]="sourceLanguageList()"
        [languageCodeSelected]="
          store.languageSelectors.sourceLanguageCodeSelected()
        "
        [autoDetectLabel]="'Chinese (Simplified)'"
        (languageSelected)="
          store.languageSelectors.setSourceLanguageCodeSelected($event.code)
        " />
      <app-icon-button>swap_horiz</app-icon-button>
      <app-language-selector
        [handset]="breakpointService.isHandset()"
        [list]="targetLanguageList()"
        [languageCodeSelected]="
          store.languageSelectors.targetLanguageCodeSelected()
        "
        (languageSelected)="
          store.languageSelectors.setTargetLanguageCodeSelected($event.code)
        " />
    </div>
  `,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectors {
  readonly #listLanguages = inject(ListLanguagesUsecase);
  protected readonly store = inject(Store);
  protected readonly breakpointService = inject(BreakpointService);

  readonly languageList = rxResource({
    stream: () => this.#listLanguages.execute(),
    defaultValue: [],
  });

  readonly sourceLanguageList = computed(() => {
    const allLanguages = this.languageList.value();
    const targetLanguageCode =
      this.store.languageSelectors.targetLanguageCodeSelected();
    return [
      Language.create({ code: 'und', name: 'Auto detect' }),
      ...allLanguages.filter(
        (language) => language.code !== targetLanguageCode,
      ),
    ];
  });

  readonly targetLanguageList = computed(() => {
    const allLanguages = this.languageList.value();
    const sourceLanguageCode =
      this.store.languageSelectors.sourceLanguageCodeSelected();
    return allLanguages.filter(
      (language) => language.code !== sourceLanguageCode,
    );
  });
}
