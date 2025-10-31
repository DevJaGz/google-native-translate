import { inject, Injectable } from '@angular/core';
import { AppError, ErrorType, TranslateTextRequest, TranslationText, Usecase } from '@core/models';
import {
  LanguageDetectorPort,
  LanguageDetectorResult,
  LanguagesPort,
  TextTranslatorPort,
} from '@core/ports';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateTextUsecase implements Usecase<TranslateTextRequest, TranslationText> {
  readonly #languageDetector = inject(LanguageDetectorPort);
  readonly #textTranslator = inject(TextTranslatorPort);
  readonly #languages = inject(LanguagesPort);

  execute(request: TranslateTextRequest): Observable<TranslationText> {
    const sourceLanguageCode$ = this.handleSourceLanguageCode(request);
    return sourceLanguageCode$.pipe(
      switchMap((sourceLanguageCode) => this.handleTranslation(request, sourceLanguageCode)),
      catchError((error) =>
        throwError(() =>
          error instanceof AppError
            ? error
            :  AppError.create({ type: ErrorType.UNKNOWN, originalError: error })
        )
      )
    );
  }

  protected handleSourceLanguageCode(request: TranslateTextRequest): Observable<string> {
    return request.sourceLanguageCode
      ? of(request.sourceLanguageCode)
      : this.detectLanguage(request.text).pipe(
          map((results) => {
            const [best] = results;
            if (!best || best.confidence < 0.5) {
              throw AppError.create({ type: ErrorType.LANGUAGE_NOT_DETECTED });
            }
            return best.languageCode;
          })
        );
  }

  protected detectLanguage(text: string): Observable<LanguageDetectorResult[]> {
    return this.#languages.listLanguageCodes().pipe(
      switchMap((supportedLanguageCodes) =>
        this.#languageDetector.detect({
          text,
          options: {
            supportedLanguageCodes,
          },
        })
      )
    );
  }

  protected handleTranslation(
    request: TranslateTextRequest,
    sourceLanguageCode: string
  ): Observable<TranslationText> {
    return this.#textTranslator
      .translate({
        text: request.text,
        targetLanguageCode: request.targetLanguageCode,
        sourceLanguageCode,
      })
      .pipe(
        map((translatedText) =>
          TranslationText.create(
            request.text,
            translatedText,
            sourceLanguageCode,
            request.targetLanguageCode
          )
        )
      );
  }
}
