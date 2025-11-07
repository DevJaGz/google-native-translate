declare global {
  /**
   * Utility type to simplify and "prettify" inferred or complex types.
   * Expands intersections/unions for easier reading in IDEs.
   */
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

  interface Window {
    LanguageDetector: typeof LanguageDetector;
    Translator: typeof Translator;
  }

  /**
   * Experimental LanguageDetector API
   * https://developer.mozilla.org/docs/Web/API/LanguageDetector
   */
  class LanguageDetector {
    readonly inputQuota: number;

    static availability(options?: {
      expectedInputLanguages?: string[];
    }): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>;

    static create(options?: {
      expectedInputLanguages?: string[];
      monitor?: (monitor: EventTarget) => void;
      signal?: AbortSignal;
    }): Promise<LanguageDetector>;

    destroy(): void;

    detect(
      input: string,
      options?: { signal?: AbortSignal }
    ): Promise<{ detectedLanguage: string; confidence: number }[]>;
  }

  /**
   * Experimental Translator API
   * https://developer.mozilla.org/docs/Web/API/Translator
   */
  class Translator {
    static availability(config: {
      sourceLanguage: string;
      targetLanguage: string;
    }): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>;

    static create(config: {
      sourceLanguage: string;
      targetLanguage: string;
      monitor?: (monitor: EventTarget) => void;
      signal?: AbortSignal;
    }): Promise<Translator>;

    destroy(): void;

    translate(input: string, options?: { signal?: AbortSignal }): Promise<string>;

    translateStreaming(
      input: string,
      options?: { signal?: AbortSignal }
    ): ReadableStream<string>;
  }
}

export {};
