import { inject, Injectable } from '@angular/core';
import { TranslateTextUsecase } from '@core/use-cases';
import { Store } from '@ui/store';
import { scan, Subject, takeUntil, tap } from 'rxjs';
import { NotificationService } from './notification';
import { LocalXHelper } from '@shared/helpers';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { AUTO_DETECT_LANGUAGE_CODE } from '@ui/constants';

@Injectable({
  providedIn: 'root',
})
export class TextTranslationService {
  readonly #store = inject(Store);
  readonly #translateText = inject(TranslateTextUsecase);
  readonly #notificationService = inject(NotificationService);
  readonly #localXHelper = inject(LocalXHelper);
  protected readonly reset$ = new Subject<void>();
  protected snackbarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;

  translate(text: string): void {
    const sourceLanguageCode = this.#store.sourceLanguageCode();
    const targetLanguageCode = this.#store.targetLanguageName();
    const previousText = this.#store.sourceText();
    const currentText = text.trim();

    if (currentText === previousText) {
      return;
    }

    this.#store.patchState({
      isLoading: true,
      sourceText: currentText,
      sourceLanguageCode: sourceLanguageCode,
      targetLanguageCode: targetLanguageCode,
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
            this.#store.patchState({
              languageDetectedCode:
                // When this is true, is because no auto-detect was performed
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
          error: (error) => {
            console.error('Translation error', error);
            this.#store.patchState({ isLoading: false });
          },
          complete: () => {
            this.#store.patchState({ isLoading: false });
          },
        }),
      )
      .subscribe();
  }

  protected handleProgressNotification(
    event: ProgressEvent,
    contextLabel: string,
  ) {
    const sourceLanguageCode = this.#store.sourceLanguageCode();
    const targetLanguageCode = this.#store.targetLanguageCode();

    const progressMessage = `A model is being downloaded for ${
      contextLabel
    } (${Math.floor((event.loaded / event.total) * 100)}%), please wait...`;

    const sourceLanguageName = sourceLanguageCode
      ? this.#localXHelper.languageNameIn('en').of(sourceLanguageCode)
      : 'Unknown';
    const targetLanguageName = targetLanguageCode
      ? this.#localXHelper.languageNameIn('en').of(targetLanguageCode)
      : 'Unknown';

    const rangeMessage =
      sourceLanguageCode && targetLanguageCode
        ? ` for "${sourceLanguageName}" to "${targetLanguageName}"`
        : '';

    const doneMessage = `A ${contextLabel} model ${rangeMessage} has been downloaded successfully.`;
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
