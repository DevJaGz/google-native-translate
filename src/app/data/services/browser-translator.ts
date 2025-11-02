import { inject, Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { TextTranslatorRequest, TextTranslatorPort } from '@core/ports';
import { BrowserTranslationApi } from './browser-translation-api';
import { SupportLangauges } from '@shared/models';
import { AppError, ErrorType } from '@core/models';
import { ReadableStreamHelper } from '@shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class BrowserTranslator
  extends BrowserTranslationApi<Translator, TextTranslatorRequest>
  implements TextTranslatorPort
{
  readonly #readableStreamHelper = inject(ReadableStreamHelper);
  protected currentSourceLanguageCode: string | null = null;
  protected currentTargetLanguageCode: string | null = null;


  translate(request: TextTranslatorRequest): Observable<string> {
    return request.options?.stream
      ? this.translateTextStreaming(request)
      : this.translateText(request);
  }

  hasBrowserSupport(): Observable<boolean> {
    return of('Translator' in self);
  }

  protected translateText(request: TextTranslatorRequest): Observable<string> {
    return this.getSession(request).pipe(
      switchMap((session) =>
        from(
          session.translate(request.text, {
            signal: request.options?.abortSignal,
          }),
        ),
      ),
      tap({
        next: () => {
          this.currentSourceLanguageCode = request.sourceLanguageCode;
          this.currentTargetLanguageCode = request.targetLanguageCode;
        },
      }),
    );
  }

  protected translateTextStreaming(
    request: TextTranslatorRequest,
  ): Observable<string> {
    return this.getSession(request).pipe(
      switchMap((session) =>
        from(
          session.translateStreaming(request.text, {
            signal: request.options?.abortSignal,
          }),
        ),
      ),
      tap({
        next: () => {
          this.currentSourceLanguageCode = request.sourceLanguageCode;
          this.currentTargetLanguageCode = request.targetLanguageCode;
        },
      }),
      switchMap((stream) => this.#readableStreamHelper.toObservable(stream)),
    );
  }

  protected isAvailable(request: SupportLangauges): Observable<boolean> {
    return from(
      Translator.availability({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
      }),
    ).pipe(map((result) => result === 'available'));
  }

  protected createSession(
    request: TextTranslatorRequest,
    monitor?: (event: EventTarget) => void,
  ): Observable<Translator> {
    return from(
      Translator.create({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
        signal: request.options?.abortSignal,
        monitor,
      }),
    );
  }

  protected isOperationSupported(
    request: SupportLangauges,
  ): Observable<boolean> {
    return from(
      Translator.availability({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
      }),
    ).pipe(map((result) => result !== 'unavailable'));
  }

  protected operationNotSupportedError(): AppError {
    return AppError.create({
      type: ErrorType.TEXT_TRANSLATION_NOT_SUPPORTED,
    });
  }

  protected isSessionValid(request: TextTranslatorRequest): boolean {
    return (
      this.currentSourceLanguageCode === request.sourceLanguageCode &&
      this.currentTargetLanguageCode === request.targetLanguageCode
    );
  }
}
