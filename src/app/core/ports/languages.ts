import { Observable } from 'rxjs';
import { Language } from '../models';
import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';

export abstract class LanguagesPort {
  abstract listLanguages(): Observable<Language[]>;
  abstract listLanguageCodes(): Observable<string[]>;
}

export const provideLanguages = (useExisting: Type<LanguagesPort>): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: LanguagesPort,
      useExisting,
    },
  ]);
};
