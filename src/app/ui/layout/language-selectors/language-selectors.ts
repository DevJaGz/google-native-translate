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
import {
  AUTO_DETECT_LANGUAGE_CODE,
  AUTO_DETECT_LANGUAGE_NAME,
} from '@ui/constants';
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
        [languageCodeSelected]="store.sourceLanguageCode()"
        [languageDetectedName]="store.languageDetectedName()"
        (languageSelected)="handleSourceLanguageSelected($event)" />
      <app-icon-button [isDisabled]="store.isAutoDetect()"
        >swap_horiz</app-icon-button
      >
      <app-language-selector
        [handset]="breakpointService.isHandset()"
        [list]="targetLanguageList()"
        [languageCodeSelected]="store.targetLanguageCode()"
        (languageSelected)="
          store.patchState({ targetLanguageCode: $event.code })
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
    const targetLanguageCode = this.store.targetLanguageName();
    return [
      Language.create({
        code: AUTO_DETECT_LANGUAGE_CODE,
        name: AUTO_DETECT_LANGUAGE_NAME,
      }),
      ...allLanguages.filter(
        (language) => language.code !== targetLanguageCode,
      ),
    ];
  });

  readonly targetLanguageList = computed(() => {
    const allLanguages = this.languageList.value();
    const sourceLanguageCode = this.store.sourceLanguageCode();
    return allLanguages.filter(
      (language) => language.code !== sourceLanguageCode,
    );
  });

  protected handleSourceLanguageSelected(language: Language) {
    const isAutoDetect = this.store.isAutoDetect();
    const languageDetectedCode = this.store.languageDetectedCode();
    this.store.patchState({
      sourceLanguageCode: language.code,
      languageDetectedCode: isAutoDetect ? languageDetectedCode : '',
    });
  }
}
