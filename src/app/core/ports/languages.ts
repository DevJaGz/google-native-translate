import { Observable } from 'rxjs';
import { Languages } from '../models';
import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';

export abstract class LanguagesPort {
  abstract listLanguages(): Observable<Languages>;
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
