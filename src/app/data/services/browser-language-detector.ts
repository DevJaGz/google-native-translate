import { Injectable } from '@angular/core';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { LanguageDetectorPort, LanguageDetectorRequest, LanguageDetectorResult } from '@core/ports';
import { BrowserTranslationApi } from './browser-translation-api';

@Injectable({
  providedIn: 'root',
})
export class BrowserLanguageDetector
  extends BrowserTranslationApi<LanguageDetector>
  implements LanguageDetectorPort
{
  detect(request: LanguageDetectorRequest): Observable<LanguageDetectorResult[]> {
    const session$ = this.session ? of(this.session) : this.createSession(request);
    return session$.pipe(
      switchMap((session) =>
        from(session.detect(request.text, { signal: request.options?.abortSignal }))
      ),
      map((result) =>
        result.map(
          ({ confidence, detectedLanguage }): LanguageDetectorResult => ({
            languageCode: detectedLanguage,
            confidence,
          })
        )
      )
    );
  }

  isSupported(): Observable<boolean> {
    if (!('LanguageDetector' in self)) {
      return of(false);
    }
    return from(LanguageDetector.availability()).pipe(
      map((available) => available !== 'unavailable')
    );
  }

  protected createSession(request: LanguageDetectorRequest): Observable<LanguageDetector> {
    return from(
      LanguageDetector.create({
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
        expectedInputLanguages: request.options?.supportedLanguageCodes,
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
