import { Type, ExistingProvider } from '@angular/core';
import { AbortOperationOption, MonitorProgressOption, SupportLangauges } from '@shared/models';
import { Observable } from 'rxjs';


export type TextTranslatorRequest = {
  text: string;
  options?: Prettify<AbortOperationOption & MonitorProgressOption>;
} & Prettify<SupportLangauges>;

export abstract class TextTranslatorPort {
  abstract translate(request: TextTranslatorRequest): Observable<string>;
  abstract isSupported(request: SupportLangauges): Observable<boolean>;
};

export const provideTextTranslator = (useExisting: Type<TextTranslatorPort>): ExistingProvider => {
  return {
    provide: TextTranslatorPort,
    useExisting
  }
}
