
export type LanguageCode = 'autoDetected' | (string & {});

export class Language {
  constructor(readonly code: LanguageCode, readonly name: string) {}
  static create(data: Partial<Language>): Language {
    return new Language(data.code ?? 'autoDetected', data.name ?? 'Auto Detected');
  }
}

export type Languages = Language[];
