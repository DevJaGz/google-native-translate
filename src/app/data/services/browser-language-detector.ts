import { Injectable } from '@angular/core';
import {
  combineLatest,
  filter,
  finalize,
  from,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { LanguageDetectorPort, LanguageDetectorRequest, LanguageDetectorResult } from '@core/ports';
import { BrowserTranslationApi } from './browser-translation-api';

@Injectable({
  providedIn: 'root',
})
export class BrowserLanguageDetector
  extends BrowserTranslationApi<LanguageDetector>
  implements LanguageDetectorPort
{
  protected supportedLanguageCodesSignature: string | null = null;

  detect(request: LanguageDetectorRequest): Observable<LanguageDetectorResult[]> {
    const session$ = this.getSession(request);
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
    return from(LanguageDetector.availability()).pipe(map((result) => result !== 'unavailable'));
  }

  protected isAvailable(): Observable<boolean> {
    return from(LanguageDetector.availability()).pipe(map((result) => result === 'available'));
  }

  protected hasSameSupportedLanguages(request: LanguageDetectorRequest): boolean {
    const languages = request.options?.supportedLanguageCodes;
    if (!languages) {
      return true;
    }

    const signature = languages.join('|'); // 'en|fr|de'
    const isSame = this.supportedLanguageCodesSignature === signature;
    this.supportedLanguageCodesSignature = signature;
    return isSame;
  }

  protected getSession(request: LanguageDetectorRequest): Observable<LanguageDetector> {
    if (this.session && this.hasSameSupportedLanguages(request)) {
      return of(this.session);
    }

    this.destroySession();

    return this.isAvailable().pipe(
      switchMap((isAvailable) =>
        isAvailable ? this.createSession(request) : this.createAndMonitorSession(request)
      ),
      tap({
        next: (session) => {
          this.session = session;
        },
      })
    );
  }

  protected createSession(request: LanguageDetectorRequest): Observable<LanguageDetector> {
    return from(
      LanguageDetector.create({
        signal: request.options?.abortSignal,
        expectedInputLanguages: request.options?.supportedLanguageCodes,
      })
    );
  }

  protected createAndMonitorSession(
    request: LanguageDetectorRequest
  ): Observable<LanguageDetector> {
    const progress$ = new Subject<ProgressEvent>();

    const monitor = (event: EventTarget) => {
      this.progressListener = (result: Event) => {
        progress$.next(result as ProgressEvent);
      };
      event.addEventListener('downloadprogress', this.progressListener);
    };

    const session$ = from(
      LanguageDetector.create({
        expectedInputLanguages: request.options?.supportedLanguageCodes,
        signal: request.options?.abortSignal,
        monitor,
      })
    );

    const ready$ = progress$.pipe(
      tap({
        next: (progress) => {
          const monitorFn = request.options?.monitor;
          if (monitorFn) {
            monitorFn(progress);
          }
        },
      }),
      filter((progress) => progress.loaded === progress.total)
    );

    return combineLatest([session$, ready$]).pipe(
      map(([session]) => session),
      finalize(() => progress$.complete())
    );
  }
}
