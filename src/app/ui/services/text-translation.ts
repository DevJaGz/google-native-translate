import { inject, Injectable } from '@angular/core';
import { TranslateTextUsecase } from '@core/use-cases';
import { Store } from '@ui/store';
import { scan, Subject, takeUntil, tap } from 'rxjs';
import { AUTO_DETECT_LANGUAGE_CODE } from '@ui/constants';
import { TranslationNotificationsService } from './translation-notifications';

@Injectable({
  providedIn: 'root',
})
export class TextTranslationService {
  readonly #store = inject(Store);
  readonly #translateText = inject(TranslateTextUsecase);
  readonly #translationNotificationsService = inject(
    TranslationNotificationsService,
  );
  protected readonly reset$ = new Subject<void>();
  protected previousSourceLanguageCode = '';
  protected previousTargetLanguageCode = '';

  translate(text: string): void {
    const currentSourceLanguageCode = this.#store.sourceLanguageCode();
    const sourceLanguageCode =
      currentSourceLanguageCode || this.#store.languageDetectedCode();
    const targetLanguageCode = this.#store.targetLanguageCode();
    const previousText = this.#store.sourceText();
    const currentText = text.trim();

    if (
      currentText === previousText &&
      sourceLanguageCode === this.previousSourceLanguageCode &&
      targetLanguageCode === this.previousTargetLanguageCode
    ) {
      return;
    }

    this.previousSourceLanguageCode = sourceLanguageCode;
    this.previousTargetLanguageCode = targetLanguageCode;

    this.#store.patchState({
      isLoading: true,
      sourceText: currentText,
    });

    this.reset$.next();

    this.#translateText
      .execute({
        text,
        sourceLanguageCode,
        targetLanguageCode,
        detection: {
          monitor: (event) => {
            this.#translationNotificationsService.handleDetectorProgressNotification(
              event,
            );
          },
        },
        translation: {
          monitor: (event) => {
            this.#translationNotificationsService.handleTranslatorProgressNotification(
              event,
            );
          },
        },
      })
      .pipe(
        takeUntil(this.reset$),
        tap({
          next: (translatation) => {
            this.#store.patchState({
              languageDetectedCode:
                // When this is true, is because no auto-detect was performed
                currentSourceLanguageCode &&
                sourceLanguageCode === translatation.sourceLanguageCode
                  ? AUTO_DETECT_LANGUAGE_CODE
                  : translatation.sourceLanguageCode,
            });
          },
        }),
        scan((acc, current) => acc + current.translatedContent(), ''),
        tap({
          next: (translatedText) => {
            this.#store.patchState({ translatedText });
          },
          error: () => {
            this.#store.patchState({ isLoading: false });
          },
          complete: () => {
            this.#store.patchState({ isLoading: false });
          },
        }),
      )
      .subscribe();
  }
}
