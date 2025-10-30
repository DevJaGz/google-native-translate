import { LanguageEvent, LanguageRequestOptions } from '@shared/models';
import { Observable } from 'rxjs';


export type TranslatorRequest = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  options?: LanguageRequestOptions;
}

export abstract class TranslatorPort {
  abstract translate(request: TranslatorRequest): Observable<LanguageEvent>;
};
