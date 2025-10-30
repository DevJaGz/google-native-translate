import { inject, Injectable } from '@angular/core';
import { TranslateTextRequest, TranslateTextResponse, TranslateTextResult } from '@core/models';
import { TranslatorPort } from '@core/ports';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  readonly #translator = inject(TranslatorPort);
  getTranslation(
    request: TranslateTextRequest,
    sourceLanguageCode$: Observable<string>,
    subscriber: Subscriber<TranslateTextResponse>
  ): Observable<TranslateTextResult> {
    throw new Error('Method not implemented.');
  }
}
