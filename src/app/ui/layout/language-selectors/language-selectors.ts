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
import { BreakpointService, TextTranslationService } from '@ui/services';
import { Store } from '@ui/store';

@Component({
  selector: 'app-language-selectors',
  imports: [IconButton, LanguageSelector],
  template: `
    <div class="flex items-center gap-2 h-12 justify-center">
      <app-language-selector
        [handset]="breakpointService.isHandset()"
        [isDisabled]="store.isLoading()"
        [list]="sourceLanguageList()"
        [languageCodeSelected]="store.sourceLanguageCode()"
        [languageDetectedName]="store.languageDetectedName()"
        (languageSelected)="handleSourceLanguageSelected($event)" />
      <app-icon-button
        [isDisabled]="store.isAutoDetect() || store.isLoading()"
        (click)="handleSwapLangauges()"
        (keydown.enter)="handleSwapLangauges()">
        swap_horiz</app-icon-button
      >
      <app-language-selector
        [handset]="breakpointService.isHandset()"
        [isDisabled]="store.isLoading()"
        [list]="targetLanguageList()"
        [languageCodeSelected]="store.targetLanguageCode()"
        (languageSelected)="handleTargetLanguageSelected($event)" />
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
  readonly #textTranslationService = inject(TextTranslationService);
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

  protected handleSourceLanguageSelected(language: Language): void {
    const sourceLanguageCode = language.code;
    const hasSourceLanguage = sourceLanguageCode !== AUTO_DETECT_LANGUAGE_CODE;
    const languageDetectedCode = this.store.languageDetectedCode();

    this.store.patchState({
      sourceLanguageCode,
      // If the user has selected a language, the auto-detect language is set to its default value (AUTO_DETECT_LANGUAGE_CODE),
      // otherwise, the auto-detect language is set to the current detected language
      languageDetectedCode: hasSourceLanguage
        ? AUTO_DETECT_LANGUAGE_CODE
        : languageDetectedCode,
    });

    this.translate();
  }

  protected handleTargetLanguageSelected(language: Language): void {
    const targetLanguageCode = language.code;

    this.store.patchState({
      targetLanguageCode,
    });

    this.translate();
  }

  protected handleSwapLangauges(): void {
    this.store.patchState({
      sourceLanguageCode: this.store.targetLanguageCode(),
      targetLanguageCode: this.store.sourceLanguageCode(),
      sourceText: this.store.translatedText(),
      translatedText: this.store.sourceText(),
    });
  }

  protected translate(): void {
    const sourceText = this.store.sourceText();
    if (!sourceText) return;
    this.#textTranslationService.translate(sourceText);
  }
}
