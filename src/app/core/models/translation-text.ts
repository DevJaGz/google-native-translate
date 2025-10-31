import { MonitorOption } from '@shared/models';
import { Translation, TranslationContentType } from './translation';


export type TranslateTextEvent = {}

export type TranslateTextRequest = Prettify<{
  sourceLanguageCode: string;
  targetLanguageCode: string;
  text: string;
} & MonitorOption<TranslateTextEvent>>;


export class TranslationText extends Translation {
  readonly contentType = TranslationContentType.TEXT;
  constructor(
    private sourceText: string,
    private targetText: string,
    sourceLanguageCode: string,
    targetLanguageCode: string
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
    targetLanguageCode: string
  ): TranslationText {
    return new TranslationText(sourceText, targetText, sourceLanguageCode, targetLanguageCode);
  }
}
