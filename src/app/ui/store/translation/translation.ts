import { InjectionToken, inject } from "@angular/core";
import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";

export type TranslationState = {
   sourceText: string;
   translatedText: string;
   sourceLanguageCode: string;
   targetLanguageCode: string;
};

export const initialTranslationState: TranslationState = {
  sourceText: '',
  translatedText: '',
  sourceLanguageCode: '',
  targetLanguageCode: '',
};

export const TRANSLATION_STATE = new InjectionToken<TranslationState>(
  'Translation State',
  {
    providedIn: 'root',
    factory: () => initialTranslationState,
  },
);

export const TranslationStore = signalStore(
  { providedIn: 'root' },
  withState<TranslationState>(() => inject(TRANSLATION_STATE)),
  withMethods((store) => ({
    setSourceText(sourceText: string) {
      patchState(store, {
        sourceText,
      });
    },
    setTranslatedText(translatedText: string) {
      patchState(store, {
        translatedText,
      });
    },
    setSourceLanguageCode(sourceLanguageCode: string) {
      patchState(store, {
        sourceLanguageCode,
      });
    },
    setTargetLanguageCode(targetLanguageCode: string) {
      patchState(store, {
        targetLanguageCode,
      });
    },
    clear() {
      patchState(store, {
        sourceText: '',
        translatedText: '',
        sourceLanguageCode: '',
        targetLanguageCode: '',
      });
    },
    })),
);