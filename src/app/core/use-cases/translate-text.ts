import { inject, Injectable } from '@angular/core';
import {
  AppError,
  ErrorType,
  TranslateTextRequest, TranslationText,
  Usecase
} from '@core/models';
import {
  LanguageDetectorPort,
  LanguageDetectorResult,
  LanguagesPort,
  TextTranslatorPort,
} from '@core/ports';
import { map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateTextUsecase
  implements Usecase<TranslateTextRequest, TranslationText>
{
  readonly #languageDetector = inject(LanguageDetectorPort);
  readonly #textTranslator = inject(TextTranslatorPort);
  readonly #languages = inject(LanguagesPort);

  execute(request: TranslateTextRequest): Observable<TranslationText> {
    return this.getSourceLanguageCode(request).pipe(
      switchMap((sourceLanguageCode) =>
        this.translateText(request, sourceLanguageCode),
      ),
    );
  }

  protected getSourceLanguageCode(
    request: TranslateTextRequest,
  ): Observable<string> {
    return request.sourceLanguageCode
      ? of(request.sourceLanguageCode)
      : this.detectLanguage(request).pipe(
          map((results) => {
            const [best] = results;
            if (!best || best.confidence < 0.5) {
              throw AppError.create({ type: ErrorType.LANGUAGE_NOT_DETECTED });
            }
            return best.languageCode;
          }),
        );
  }

  protected detectLanguage(
    request: TranslateTextRequest,
  ): Observable<LanguageDetectorResult[]> {
    if (request.text.trim().length < 20) {
      return throwError(() =>
        AppError.create({ type: ErrorType.LANGUAGE_DETECTION_MIN_QUOTA }),
      );
    }
    return this.#languages.listLanguageCodes().pipe(
      switchMap((supportedLanguageCodes) =>
        this.#languageDetector.detect({
          text: request.text,
          sourceLanguageCode: request.sourceLanguageCode,
          targetLanguageCode: request.targetLanguageCode,
          options: {
            supportedLanguageCodes,
            abortSignal: request.detection?.abortSignal,
            monitor: request.detection?.monitor,
          },
        }),
      ),
    );
  }

  protected translateText(
    request: TranslateTextRequest,
    sourceLanguageCode: string,
  ): Observable<TranslationText> {
    return this.#textTranslator
      .translate({
        text: request.text,
        targetLanguageCode: request.targetLanguageCode,
        sourceLanguageCode,
        options: {
          abortSignal: request.translation?.abortSignal,
          monitor: request.translation?.monitor,
          stream: request.translation?.stream,
        },
      })
      .pipe(
        map((translatedText) => {
          return TranslationText.create(
            request.text,
            translatedText,
            sourceLanguageCode,
            request.targetLanguageCode,
          );
        })
      );
  }
}
