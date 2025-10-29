export class Translation {
  constructor(
    readonly id: string,
    readonly sourceLanguageCode: string,
    readonly targetLanguageCode: string,
    readonly originalText: string,
    readonly translatedText: string,
    readonly createdAt: string,
    readonly updatedAt: string
  ) {}

  static create(data: Partial<Translation>): Translation {
    return new Translation(
      data.id ?? '',
      data.sourceLanguageCode ?? '',
      data.targetLanguageCode ?? '',
      data.originalText ?? '',
      data.translatedText ?? '',
      data.createdAt ?? new Date().toISOString(),
      data.updatedAt ?? new Date().toISOString()
    );
  }
}

export type Translations = Translation[];
