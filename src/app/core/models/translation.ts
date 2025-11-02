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
    private _status = TranslationStatus.PENDING,
    protected createdAt = new Date(),
  ) {}

  readonly abstract contentType: TranslationContentType;
  abstract sourceContent(): unknown;
  abstract translatedContent(): unknown;

  get status() {
    return this._status;
  }

  setStatus(status: TranslationStatus) {
    this._status = status;
  }
}

export type Translations = Translation[];
