import { LanguageEvent, LanguageRequestOptions } from '@shared/models';
import { Observable } from 'rxjs';


export type LanguageDetectorRequest = {
  text: string;
  options?: LanguageRequestOptions & { supportedLanguages?: string[] };
}

export abstract class LanguageDetectorPort {
  abstract detect(request: LanguageDetectorRequest): Observable<LanguageEvent>;
};
