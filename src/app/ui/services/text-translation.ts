import { inject, Injectable } from '@angular/core';
import { TranslationText } from '@core/models';
import { TranslateTextUsecase } from '@core/use-cases';
import { Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TextTranslationService {
  readonly #translateText = inject(TranslateTextUsecase);
  protected readonly reset$ = new Subject<void>();

  translate(
    text: string,
    sourceLanguageCode: string,
    targetLanguageCode: string,
  ): Observable<TranslationText> {
    return this.#translateText.execute({
      text,
      sourceLanguageCode,
      targetLanguageCode,
      detection: {
        monitor: (event) => {
          
        },
      },
      translation: {
        monitor: (event) => {

        },
      },
    }).pipe(
      takeUntil(this.reset$)
    )
  }
}
