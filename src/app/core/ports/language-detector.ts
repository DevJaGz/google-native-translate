import { AbortOperationOption, SupportedLanguagesOption } from '@shared/models';
import { Observable } from 'rxjs';


export type LanguageDetectorRequest = {
  text: string;
  options?: Prettify<AbortOperationOption & SupportedLanguagesOption>;
}

export type LanguageDetectorResult = {
  languageCode: string;
  confidence: number;
}

export abstract class LanguageDetectorPort {
  abstract detect(request: LanguageDetectorRequest): Observable<LanguageDetectorResult[]>;
};
