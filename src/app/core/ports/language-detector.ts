import { LanguageRequestOptions } from '@shared/models';
import { Observable } from 'rxjs';


export type LanguageDetectorRequest = {
  text: string;
  options?: LanguageRequestOptions & { supportedLanguageCodes?: string[] };
}

export type LanguageDetectorResult = {
  languageCode: string;
  confidence: number;
}

export abstract class LanguageDetectorPort {
  abstract detect(request: LanguageDetectorRequest): Observable<LanguageDetectorResult[]>;
};
