import { inject, Injectable } from '@angular/core';
import { SUPPORTED_BROWSERS } from '@core/constants';
import { AppError, ErrorType, Usecase } from '@core/models';
import {
  BrowserDetectorPort,
  LanguageDetectorPort,
  TextTranslatorPort,
} from '@core/ports';
import { SupportLangauges } from '@shared/models';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckSupportUsecase implements Usecase<SupportLangauges, boolean> {
  readonly #languageDetector = inject(LanguageDetectorPort);
  readonly #textTranslator = inject(TextTranslatorPort);
  readonly #browserDetector = inject(BrowserDetectorPort);
  readonly #supportedBrowsers = inject(SUPPORTED_BROWSERS);

  execute(request: SupportLangauges): Observable<boolean> {
    return forkJoin([
      this.#languageDetector.hasBrowserSupport(),
      this.#textTranslator.hasBrowserSupport(request),
    ]).pipe(map((apiSupport) => this.hasSupport(apiSupport)));
  }

  protected hasSupport([
    hasLanguageDetectorSupport,
    hasTextTranslatorSupport,
  ]: boolean[]): boolean {
    const browserInfo = this.#browserDetector.getInfo();
    const hasBrowserSupport = this.#supportedBrowsers.find(
      (browser) =>
        browser.name === browserInfo.name &&
        browser.majorVersion >= browserInfo.majorVersion,
    );

    if (!hasBrowserSupport) {
      throw AppError.create({ type: ErrorType.BROWSER_NOT_SUPPORTED });
    }
    if (!hasLanguageDetectorSupport) {
      throw AppError.create({
        type: ErrorType.LANGUAGE_DETECTION_NOT_SUPPORTED,
      });
    }
    if (!hasTextTranslatorSupport) {
      throw AppError.create({
        type: ErrorType.TEXT_TRANSLATION_NOT_SUPPORTED,
      });
    }

    return true;
  }
}
