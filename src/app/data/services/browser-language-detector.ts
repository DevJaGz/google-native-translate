import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of, switchMap
} from 'rxjs';
import {
  LanguageDetectorPort,
  LanguageDetectorRequest,
  LanguageDetectorResult,
} from '@core/ports';
import { BrowserTranslationApi } from './browser-translation-api';
import { AppError, ErrorType } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class BrowserLanguageDetector
  extends BrowserTranslationApi<LanguageDetector, LanguageDetectorRequest>
  implements LanguageDetectorPort
{
  protected supportedLanguageCodesSignature: string | null = null;

  detect(
    request: LanguageDetectorRequest,
  ): Observable<LanguageDetectorResult[]> {
    return this.getSession(request).pipe(
      switchMap((session) =>
        from(
          session.detect(request.text, {
            signal: request.options?.abortSignal,
          }),
        ),
      ),
      map((result) =>
        result.map(
          ({ confidence, detectedLanguage }): LanguageDetectorResult => ({
            languageCode: detectedLanguage,
            confidence,
          }),
        ),
      ),
    );
  }

  hasBrowserSupport(): Observable<boolean> {
    return of('LanguageDetector' in self);
  }

  protected isAvailable(): Observable<boolean> {
    return from(LanguageDetector.availability()).pipe(
      map((result) => result === 'available'),
    );
  }

  protected createSession(
    request: LanguageDetectorRequest,
  ): Observable<LanguageDetector> {
    return from(
      LanguageDetector.create({
        signal: request.options?.abortSignal,
        expectedInputLanguages: request.options?.supportedLanguageCodes,
      }),
    );
  }

  protected isSessionValid(request: LanguageDetectorRequest): boolean {
    const languages = request.options?.supportedLanguageCodes;
    if (!languages) {
      return true;
    }
    const signature = languages.join('|'); // 'en|fr|de'
    const hasSameSignature = this.supportedLanguageCodesSignature === signature;
    this.supportedLanguageCodesSignature = signature;
    return hasSameSignature;
  }

  protected isOperationSupported(): Observable<boolean> {
    return from(LanguageDetector.availability()).pipe(
      map((result) => result !== 'unavailable'),
    );
  }

  protected operationNotSupportedError(): AppError {
    return AppError.create({
      type: ErrorType.LANGUAGE_DETECTION_NOT_SUPPORTED,
    });
  }
}
