import { inject, Injectable } from '@angular/core';
import {
  TranslateTextRequest,
  TranslateTextResponse,
  Usecase,
} from '@core/models';
import { LanguageDetectorService, TranslatorService } from '@core/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateTextUsecase implements Usecase<TranslateTextRequest, TranslateTextResponse> {
  readonly #languageDetector = inject(LanguageDetectorService);
  readonly #translator = inject(TranslatorService);

  execute(request: TranslateTextRequest): Observable<TranslateTextResponse> {
    return new Observable<TranslateTextResponse>((subscriber) => {
      const sourceLanguageCode$ = this.#languageDetector.detectLanguageCode(request, subscriber);
      const translation$ = this.#translator.getTranslation(
        request,
        sourceLanguageCode$,
        subscriber
      );
      translation$.subscribe({
        next: (response) => subscriber.next(response),
        error: (error) => {
          subscriber.error(error);
          subscriber.complete();
        },
        complete: () => subscriber.complete(),
      });
    });
  }
}
