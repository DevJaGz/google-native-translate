import { Type, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AbortOperationOption, MonitorProgressOption, StreamedOption, SupportLangauges } from '@shared/models';
import { Observable } from 'rxjs';


export type TextTranslatorRequest = {
  text: string;
  options?: Prettify<AbortOperationOption & MonitorProgressOption & StreamedOption>;
} & Prettify<SupportLangauges>;

export abstract class TextTranslatorPort {
  abstract translate(request: TextTranslatorRequest): Observable<string>;
  abstract hasBrowserSupport(): Observable<boolean>;
};

export const provideTextTranslator = (useExisting: Type<TextTranslatorPort>): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: TextTranslatorPort,
      useExisting,
    },
  ]);
};
