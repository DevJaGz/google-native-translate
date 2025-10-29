export class Language {
  constructor(readonly code: string, readonly name: string, readonly isAuto?: boolean) {}
}

export type Languages = Language[];
