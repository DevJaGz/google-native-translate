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
          languageSelectorsStore.sourceLanguageCodeSelected()
        "
        [languageDetectedName]="languageSelectorsStore.languageDetectedName()"
        (languageSelected)="handleSourceLanguageSelected($event)" />
      <app-icon-button [isDisabled]="isSwapLanguagesDisabled()"
        >swap_horiz</app-icon-button
      >
      <app-language-selector
        [handset]="breakpointService.isHandset()"
        [list]="targetLanguageList()"
        [languageCodeSelected]="
          languageSelectorsStore.targetLanguageCodeSelected()
        "
        (languageSelected)="
          languageSelectorsStore.setTargetLanguageCodeSelected($event.code)
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
  readonly #store = inject(Store);
  protected readonly languageSelectorsStore = this.#store.languageSelectors;
  protected readonly breakpointService = inject(BreakpointService);

  readonly languageList = rxResource({
    stream: () => this.#listLanguages.execute(),
    defaultValue: [],
  });

  readonly isSwapLanguagesDisabled = computed(
    () => this.#store.languageSelectors.sourceLanguageCodeSelected() === '',
  );

  readonly sourceLanguageList = computed(() => {
    const allLanguages = this.languageList.value();
    const targetLanguageCode =
      this.#store.languageSelectors.targetLanguageCodeSelected();
    return [
      Language.create({ code: '', name: 'Auto detect' }),
      ...allLanguages.filter(
        (language) => language.code !== targetLanguageCode,
      ),
    ];
  });

  readonly targetLanguageList = computed(() => {
    const allLanguages = this.languageList.value();
    const sourceLanguageCode =
      this.#store.languageSelectors.sourceLanguageCodeSelected();
    return allLanguages.filter(
      (language) => language.code !== sourceLanguageCode,
    );
  });

  protected handleSourceLanguageSelected(language: Language) {
    const { setSourceLanguageCodeSelected, setLanguageDetectedName } =
      this.languageSelectorsStore;
    setSourceLanguageCodeSelected(language.code);
    if (language.code !== '') {
      setLanguageDetectedName('');
    }
  }
}
