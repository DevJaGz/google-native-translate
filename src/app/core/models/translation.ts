export enum TranslationContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
}

export abstract class Translation {
  constructor(
    readonly sourceLanguageCode: string,
    readonly targetLanguageCode: string,
    protected createdAt = new Date(),
  ) {}

  readonly abstract contentType: TranslationContentType;
  abstract sourceContent(): unknown;
  abstract translatedContent(): unknown;
}

export type Translations = Translation[];
