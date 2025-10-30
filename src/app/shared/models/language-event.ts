

export type DetectionResult = {
  languageCode: string;
  confidence: number;
}

export type DetectionEvent = {
  type: 'detection';
  result: DetectionResult[];
};


export type ProgressEvent = {
  type: 'progress';
  progress: number;
};


export type TranslationEvent = {
  type: 'translation';
  result: string;
};


export type LanguageEvent = DetectionEvent | ProgressEvent | TranslationEvent;
