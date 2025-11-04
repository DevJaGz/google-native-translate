import { InjectionToken, inject } from "@angular/core";
import { TranslationText } from "@core/models";
import { signalStore, withState, withMethods, patchState } from "@ngrx/signals";


export type TranslationState = {
   sourceText: string;
   translatedText: string;
   sourceLanguageCode: string;
   targetLanguageCode: string;
   languageCodeDetected: string;
   isLoading: boolean;
};

export const initialTranslationState: TranslationState = {
  sourceText: '',
  translatedText: '',
  sourceLanguageCode: '',
  targetLanguageCode: '',
  isLoading: false,
  languageCodeDetected: '',
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
    setLanguageCodeDetected(languageCodeDetected: string) {
      patchState(store, {
        languageCodeDetected,
      });
    },
    setTranslation(translation: TranslationText){
      patchState(store, {
         sourceText:translation.sourceContent(),
         translatedText: translation.translatedContent(),
         sourceLanguageCode: translation.sourceLanguageCode,
         targetLanguageCode: translation.targetLanguageCode,
      });
    },
    setIsLoading(isLoading: boolean) {
      patchState(store, {
        isLoading,
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