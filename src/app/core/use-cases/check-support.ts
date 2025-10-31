import { inject, Injectable } from '@angular/core';
import { AppError, ErrorType, Usecase } from '@core/models';
import { LanguageDetectorPort, TextTranslatorPort } from '@core/ports';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckSupportUsecase implements Usecase<void, boolean> {
  readonly #languageDetector = inject(LanguageDetectorPort);
  readonly #textTranslator = inject(TextTranslatorPort);

  execute(): Observable<boolean> {
    return forkJoin([
      this.#languageDetector.isSupported(),
      this.#textTranslator.isSupported(),
    ]).pipe(
      map(([langSupported, textSupported]) => {
        if (!langSupported) {
          throw AppError.create({ type: ErrorType.LANGUAGE_DETECTION_NOT_SUPPORTED });
        }
        if (!textSupported) {
          throw AppError.create({ type: ErrorType.TEXT_TRANSLATION_NOT_SUPPORTED });
        }
        return true;
      })
    );
  }
}
