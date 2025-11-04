import { InjectionToken, inject } from '@angular/core';
import { Language } from '@core/models';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export type LanguageSelectorsState = {
  sourceLanguageCodeSelected: string;
  targetLanguageCodeSelected: string;
  languageDetectedName: string;
};

export const initialLanguageSelectorsState: LanguageSelectorsState = {
  sourceLanguageCodeSelected: 'es',
  targetLanguageCodeSelected: 'en',
  languageDetectedName: '',
};

export const LANGUAGE_SELECTORS_STATE =
  new InjectionToken<LanguageSelectorsState>(
    'Language Selectors State',
    {
      providedIn: 'root',
      factory: () => initialLanguageSelectorsState,
    },
  );

export const LanguageSelectorsStore = signalStore(
  { providedIn: 'root' },
  withState<LanguageSelectorsState>(() =>
    inject(LANGUAGE_SELECTORS_STATE),
  ),
  withMethods((store) => ({
    setSourceLanguageCodeSelected(sourceLanguageCodeSelected: string) {
      patchState(store, {
        sourceLanguageCodeSelected,
      });
    },
    setTargetLanguageCodeSelected(targetLanguageCodeSelected: string) {
      patchState(store, {
        targetLanguageCodeSelected,
      });
    },
    setLanguageDetectedName(languageDetectedName: string) {
      patchState(store, {
        languageDetectedName,
      });
    },
  })),
);
