export enum TranslationContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
}
export enum TranslationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export abstract class Translation {
  constructor(
    readonly sourceLanguageCode: string,
    readonly targetLanguageCode: string,
    protected createdAt = new Date(),
    protected status = TranslationStatus.PENDING
  ) {}

  readonly abstract contentType: TranslationContentType;
  abstract sourceContent(): unknown;
  abstract translatedContent(): unknown;
}

export type Translations = Translation[];
