import { inject, Injectable } from '@angular/core';
import { DETECTOR_MIN_CONFIDENCE, DETECTOR_MIN_QUOTA } from '@core/constants';
import { AppError, ErrorType, TranslationText, Usecase } from '@core/models';
import {
  LanguageDetectorPort,
  LanguageDetectorResult,
  LanguagesPort,
  TextTranslatorPort,
} from '@core/ports';
import {
  AbortOperationOption,
  MonitorProgressOption,
  StreamedOption,
} from '@shared/models';
import { map, Observable, of, scan, switchMap, throwError } from 'rxjs';

export type TranslateTextRequestOptions = Prettify<
  AbortOperationOption & MonitorProgressOption
>;

export type TranslateTextRequest = Prettify<
  {
    sourceLanguageCode: string;
    targetLanguageCode: string;
    text: string;
  } & {
    detection?: TranslateTextRequestOptions;
    translation?: Prettify<TranslateTextRequestOptions & StreamedOption>;
  }
>;

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
        this.translateText(
          {
            ...request,
            text: request.text,
          },
          sourceLanguageCode,
        ),
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
            if (!best || best.confidence < DETECTOR_MIN_CONFIDENCE) {
              throw AppError.create({ type: ErrorType.LANGUAGE_NOT_DETECTED });
            }
            return best.languageCode;
          }),
        );
  }

  protected detectLanguage(
    request: TranslateTextRequest,
  ): Observable<LanguageDetectorResult[]> {
    if (request.text.trim().length < DETECTOR_MIN_QUOTA) {
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
        }),
      );
  }
}
