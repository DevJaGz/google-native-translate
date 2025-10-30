export class Language {
  constructor(readonly code: string, readonly name: string) {}
  static create(data: Language): Language {
    return new Language(data.code , data.name);
  }
}

export type Languages = Language[];
