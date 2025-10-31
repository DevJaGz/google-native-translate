import { Type, ExistingProvider } from '@angular/core';
import { AbortOperationOption, MonitorProgressOption } from '@shared/models';
import { Observable } from 'rxjs';


export type TextTranslatorRequest = {
  text: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  options?: Prettify<AbortOperationOption & MonitorProgressOption>;
}

export abstract class TextTranslatorPort {
  abstract translate(request: TextTranslatorRequest): Observable<string>;
  abstract isSupported(): Observable<boolean>;
};

export const provideTextTranslator = (useExisting: Type<TextTranslatorPort>): ExistingProvider => {
  return {
    provide: TextTranslatorPort,
    useExisting
  }
}
