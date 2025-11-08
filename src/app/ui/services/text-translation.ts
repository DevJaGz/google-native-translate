import { inject, Injectable } from '@angular/core';
import { TranslateTextUsecase } from '@core/use-cases';
import { Store } from '@ui/store';
import { scan, Subject, takeUntil, tap } from 'rxjs';
import { NotificationService } from './notification';
import { LocalXHelper } from '@shared/helpers';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TextTranslationService {
  readonly #store = inject(Store);
  readonly #translateText = inject(TranslateTextUsecase);
  readonly #notificationService = inject(NotificationService);
  readonly #localXHelper = inject(LocalXHelper);
  protected readonly translationStore = this.#store.translation;
  protected readonly languageSelectorsStore = this.#store.languageSelectors;
  protected readonly reset$ = new Subject<void>();
  protected snackbarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;

  translate(text: string): void {
    const {
      patchState,
      setLanguageCodeDetected,
      setIsLoading,
      setTranslatedText,
      sourceText,
    } = this.translationStore;
    const { sourceLanguageCodeSelected, targetLanguageCodeSelected } =
      this.languageSelectorsStore;
    const sourceLanguageCode = sourceLanguageCodeSelected();
    const targetLanguageCode = targetLanguageCodeSelected();
    const previousText = sourceText();
    const currentText = text.trim();

    if (currentText === previousText) {
      return;
    }

    patchState({
      sourceLanguageCode,
      targetLanguageCode,
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
            this.handleProgressNotification(event, 'Detecting language');
          },
        },
        translation: {
          monitor: (event) => {
            this.handleProgressNotification(event, 'Translating text');
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

  protected handleProgressNotification(
    event: ProgressEvent,
    contextLabel: string,
  ) {
    const { sourceLanguageCodeSelected, targetLanguageCodeSelected } =
      this.languageSelectorsStore;

    const sourceLanguageCode = sourceLanguageCodeSelected();
    const targetLanguageCode = targetLanguageCodeSelected();

    const progressMessage = `A model is being downloaded for ${
      contextLabel
    } (${Math.floor((event.loaded / event.total) * 100)}%), please wait...`;

    const sourceLanguageName = this.#localXHelper
      .languageNameIn('en')
      .of(sourceLanguageCode);
    const targetLanguageName = this.#localXHelper
      .languageNameIn('en')
      .of(targetLanguageCode);

    const doneMessage = `A ${contextLabel} model for "${sourceLanguageName}" to "${targetLanguageName}" has been downloaded successfully.`;
    const message =
      event.loaded === event.total ? doneMessage : progressMessage;

    this.notifyProgress(message);
  }

  protected notifyProgress(message: string): void {
    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
      this.snackbarRef = null;
    }

    this.snackbarRef = this.#notificationService.info(message);
  }
}
