import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';
import { AbortOperationOption, MonitorProgressOption, SupportedLanguagesOption } from '@shared/models';
import { Observable } from 'rxjs';


export type LanguageDetectorRequest = {
  text: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  options?: Prettify<AbortOperationOption & SupportedLanguagesOption & MonitorProgressOption>;
}

export type LanguageDetectorResult = {
  languageCode: string;
  confidence: number;
}

export abstract class LanguageDetectorPort {
  abstract detect(request: LanguageDetectorRequest): Observable<LanguageDetectorResult[]>;
  abstract isSupported(): Observable<boolean>;
};
export const provideLanguageDetector = (useExisting: Type<LanguageDetectorPort>): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: LanguageDetectorPort,
      useExisting,
    },
  ]);
};
