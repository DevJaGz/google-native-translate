import { inject, Injectable } from '@angular/core';
import { TranslateTextUsecase } from '@core/use-cases';
import { Store } from '@ui/store';
import { scan, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TextTranslationService {
  readonly #store = inject(Store);
  readonly #translateText = inject(TranslateTextUsecase);
  protected readonly translationStore = this.#store.translation;
  protected readonly languageSelectorsStore = this.#store.languageSelectors;
  protected readonly reset$ = new Subject<void>();

  translate(text: string): void {
    const {
      patchState,
      setLanguageCodeDetected,
      setIsLoading,
      setTranslatedText,
      sourceText
    } = this.translationStore;
    const { sourceLanguageCodeSelected, targetLanguageCodeSelected,  } =
      this.languageSelectorsStore;
    const sourceLanguageCode = sourceLanguageCodeSelected();
    const targetLanguageCode = targetLanguageCodeSelected();
    const previousText = sourceText();
    const currentText = text.trim();

    if (currentText === previousText){
      return;
    }

    patchState({
      sourceLanguageCode,
      targetLanguageCode,
      isLoading: true,
      sourceText: currentText,
      translatedText: '',
    });

    this.reset$.next();

    this.#translateText
      .execute({
        text,
        sourceLanguageCode,
        targetLanguageCode,
        detection: {
          monitor: (event) => {
            this.handleDetectionProgress(event);
          },
        },
        translation: {
          monitor: (event) => {
            this.handleTranslationProgress(event);
          },
        },
      })
      .pipe(
        takeUntil(this.reset$),
        tap({
          next: (translatation) => {
            setLanguageCodeDetected(
              sourceLanguageCode === translatation.sourceLanguageCode
                ? ''
                : translatation.sourceLanguageCode,
            );
          },
        }),
        scan((acc, current) => acc + current.translatedContent(), ''),
        tap({
          next: (translatedText) => {
            setTranslatedText(translatedText);
          },
          error: (error) => {
            console.error('Translation error', error);
            setIsLoading(false);
          },
          complete: () => {
            setIsLoading(false);
          },
        }),
      )
      .subscribe();
  }

  protected handleDetectionProgress(event: ProgressEvent) {
    console.log('handleDetectionProgress', event.loaded, event.total);
    // TODO: handle detection progress
  }

  protected handleTranslationProgress(event: ProgressEvent) {
    // TODO: handle translation progress
    console.log('handleTranslationProgress', event.loaded, event.total);
  }
}
