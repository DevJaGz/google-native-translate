import { DetectionEvent } from '@shared/models';
import { Translation, TranslationContentType } from './translation';

export type TranslateTextRequest = {
  sourceLanguageCode: string;
  targetLanguageCode: string;
  text: string;
};

export type TranslateTextProgressContext = 'DETECTING' | 'TRANSLATING';

export type TranslateTextProgress = {
  type: 'progress';
  action: TranslateTextProgressContext;
  progress: number;
};

export type TranslateTextResult = {
  type: 'translation';
  result: TranslationText;
};

export type TranslateTextResponse = TranslateTextResult | TranslateTextProgress | DetectionEvent;

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

export type TranslationTexts = TranslationText[];
