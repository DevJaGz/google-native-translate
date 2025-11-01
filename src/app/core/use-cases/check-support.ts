import { inject, Injectable } from '@angular/core';
import { AppError, ErrorType, Usecase } from '@core/models';
import { LanguageDetectorPort, TextTranslatorPort } from '@core/ports';
import { SupportLangauges } from '@shared/models';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckSupportUsecase implements Usecase<SupportLangauges, boolean> {
  readonly #languageDetector = inject(LanguageDetectorPort);
  readonly #textTranslator = inject(TextTranslatorPort);

  execute(request: SupportLangauges): Observable<boolean> {
    return forkJoin([
      this.#languageDetector.hasBrowserSupport(),
      this.#textTranslator.hasBrowserSupport(request),
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
