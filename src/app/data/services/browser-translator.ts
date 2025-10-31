import { Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { LanguageDetectorRequest, TextTranslatorPort } from '@core/ports';
import { BrowserTranslationApi } from './browser-translation-api';
import { SupportLangauges } from '@shared/models';
import { AppError, ErrorType } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class BrowserTranslator
  extends BrowserTranslationApi<Translator>
  implements TextTranslatorPort
{
  protected currentSourceLanguageCode: string | null = null;
  protected currentTargetLanguageCode: string | null = null;

  translate(request: LanguageDetectorRequest): Observable<string> {
    const hasSupport$ = this.hasLanguageSupport(request);
    const session$ = this.getSession(request);
    const translate$ = session$.pipe(
      switchMap((session) =>
        from(session.translate(request.text, { signal: request.options?.abortSignal }))
      ),
      tap({
        next: () => {
          this.currentSourceLanguageCode = request.sourceLanguageCode;
          this.currentTargetLanguageCode = request.targetLanguageCode;
        },
      })
    );
    return hasSupport$.pipe(
      switchMap((hasSupport) =>
        hasSupport
          ? translate$
          : throwError(() => AppError.create({ type: ErrorType.TEXT_TRANSLATION_NOT_SUPPORTED }))
      )
    );
  }

  isSupported(request: SupportLangauges): Observable<boolean> {
    if (!('Translator' in self || !request.sourceLanguageCode || !request.targetLanguageCode)) {
      return of(false);
    }
    return this.hasLanguageSupport(request);
  }

  protected hasLanguageSupport(request: SupportLangauges): Observable<boolean> {
    return from(
      Translator.availability({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
      })
    ).pipe(map((available) => available !== 'unavailable'));
  }

  protected hasSameLanguages(request: LanguageDetectorRequest): boolean {
    return (
      this.currentSourceLanguageCode === request.sourceLanguageCode &&
      this.currentTargetLanguageCode === request.targetLanguageCode
    );
  }

  protected getSession(request: LanguageDetectorRequest): Observable<Translator> {
    return this.session && this.hasSameLanguages(request)
        ? of(this.session)
        : this.createSession(request);
  }

  protected createSession(request: LanguageDetectorRequest): Observable<Translator> {
    return from(
      Translator.create({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
        monitor: (event) => {
          const monitorFn = request.options?.monitor;
          if (!monitorFn) {
            return;
          }
          this.progressListener = (result: Event) => {
            const progress = result as ProgressEvent;
            monitorFn(progress);
          };
          event.addEventListener('downloadprogress', this.progressListener);
        },
        signal: request.options?.abortSignal,
      })
    ).pipe(
      tap({
        next: (session) => {
          this.session = session;
        },
      })
    );
  }
}
