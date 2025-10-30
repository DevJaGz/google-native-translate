import { inject, Injectable } from '@angular/core';
import { TranslateTextRequest, TranslateTextResponse } from '@core/models';
import { LanguageDetectorPort, LanguagesPort } from '@core/ports';
import { DetectionEvent, LanguageEvent } from '@shared/models';
import { Subscriber, Observable, of, switchMap, tap, filter, map } from 'rxjs';

export type GetSourceLanguageRequest = {
  text: string;
  sourceLanguageCode?: string;
};

@Injectable({
  providedIn: 'root',
})
export class LanguageDetectorService {
  readonly #languageDetector = inject(LanguageDetectorPort);
  readonly #languages = inject(LanguagesPort);

  detectLanguageCode(
    request: GetSourceLanguageRequest,
    subscriber: Subscriber<TranslateTextResponse>
  ): Observable<string> {
    return request.sourceLanguageCode
      ? of(request.sourceLanguageCode)
      : this.#languages
          .listLanguageCodes()
          .pipe(
            switchMap((languageCodes) => this.detectLanguage(request, languageCodes, subscriber))
          );
  }

  protected detectLanguage(
    request: GetSourceLanguageRequest,
    supportedLanguages: string[],
    subscriber: Subscriber<TranslateTextResponse>
  ): Observable<string> {
    return this.#languageDetector
      .detect({
        text: request.text,
        options: {
          supportedLanguages,
        },
      })
      .pipe(
        tap({
          next: (event) => this.notifyDetection(subscriber, event),
        }),
        filter((event): event is DetectionEvent => event.type === 'detection'),
        map((event) => {
          const [best] = event.result;
          if (!best || best.confidence < 0.5) {
            throw new Error('No language detected');
          }
          return best.languageCode;
        })
      );
  }

  protected notifyDetection(
    subscriber: Subscriber<TranslateTextResponse>,
    event: LanguageEvent
  ): void {
    if (event.type === 'progress') {
      subscriber.next({
        type: 'progress',
        action: 'DETECTING',
        progress: event.progress,
      });
    } else if (event.type === 'detection') {
      subscriber.next(event);
    }
  }
}
