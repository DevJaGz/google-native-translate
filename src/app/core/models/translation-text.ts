import { AbortOperationOption, MonitorProgressOption, StreamedOption } from '@shared/models';
import {
  Translation,
  TranslationContentType,
} from './translation';

export type TranslateTextRequestOptions = Prettify<
  AbortOperationOption & MonitorProgressOption
>;

export type TranslateTextRequest = Prettify<
  {
    sourceLanguageCode: string;
    targetLanguageCode: string;
    text: string;
  } & {
    detection?: TranslateTextRequestOptions ;
    translation?: Prettify<TranslateTextRequestOptions & StreamedOption>;
  }
>;

export class TranslationText extends Translation {
  readonly contentType = TranslationContentType.TEXT;
  constructor(
    private sourceText: string,
    private targetText: string,
    sourceLanguageCode: string,
    targetLanguageCode: string,
  ) {
    super(sourceLanguageCode, targetLanguageCode);
  }

  sourceContent(): string {
    return this.sourceText;
  }

  translatedContent(): string {
    return this.targetText;
  }

  static create(
    sourceText: string,
    targetText: string,
    sourceLanguageCode: string,
    targetLanguageCode: string,
  ): TranslationText {
    return new TranslationText(
      sourceText,
      targetText,
      sourceLanguageCode,
      targetLanguageCode,
    );
  }
}
