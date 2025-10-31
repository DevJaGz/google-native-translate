import { Injectable } from '@angular/core';
import {
  combineLatest,
  filter,
  finalize,
  forkJoin,
  from,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
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
    ).pipe(map((result) => result !== 'unavailable'));
  }

  protected isAvailable(request: SupportLangauges): Observable<boolean> {
    return from(
      Translator.availability({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
      })
    ).pipe(map((result) => result === 'available'));
  }

  protected hasSameLanguages(request: LanguageDetectorRequest): boolean {
    return (
      this.currentSourceLanguageCode === request.sourceLanguageCode &&
      this.currentTargetLanguageCode === request.targetLanguageCode
    );
  }

  protected getSession(request: LanguageDetectorRequest): Observable<Translator> {
    if (this.session && this.hasSameLanguages(request)) {
      return of(this.session);
    }

    return this.isAvailable(request).pipe(
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

  protected createSession(request: LanguageDetectorRequest): Observable<Translator> {
    return from(
      Translator.create({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
        signal: request.options?.abortSignal,
      })
    );
  }

  protected createAndMonitorSession(request: LanguageDetectorRequest): Observable<Translator> {
    const progress$ = new Subject<ProgressEvent>();

    const monitor = (event: EventTarget) => {
      this.progressListener = (result: Event) => {
        progress$.next(result as ProgressEvent);
      };
      event.addEventListener('downloadprogress', this.progressListener);
    };

    const session$ = from(
      Translator.create({
        sourceLanguage: request.sourceLanguageCode,
        targetLanguage: request.targetLanguageCode,
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
