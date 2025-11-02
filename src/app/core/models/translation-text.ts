import { AbortOperationOption, MonitorProgressOption, StreamedOption } from '@shared/models';
import {
  Translation,
  TranslationContentType,
  TranslationStatus,
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
    status: TranslationStatus,
    sourceLanguageCode: string,
    targetLanguageCode: string,
  ) {
    super(sourceLanguageCode, targetLanguageCode, status);
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
    status = TranslationStatus.PENDING,
  ): TranslationText {
    return new TranslationText(
      sourceText,
      targetText,
      status,
      sourceLanguageCode,
      targetLanguageCode,
    );
  }
}
