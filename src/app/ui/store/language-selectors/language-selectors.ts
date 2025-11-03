import { InjectionToken, inject } from '@angular/core';
import { Language } from '@core/models';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export type LanguageSelectorsState = {
  sourceLanguageCodeSelected: string;
  targetLanguageCodeSelected: string;
};

export const initialLanguageSelectorsState: LanguageSelectorsState = {
  sourceLanguageCodeSelected: 'es',
  targetLanguageCodeSelected: 'en',
};

export const LANGUAGE_SELECTORS_STATE_FEATURE =
  new InjectionToken<LanguageSelectorsState>(
    'Language Selectors State Feature',
    {
      providedIn: 'root',
      factory: () => initialLanguageSelectorsState,
    },
  );

export const LanguageSelectorsStore = signalStore(
  { providedIn: 'root' },
  withState<LanguageSelectorsState>(() =>
    inject(LANGUAGE_SELECTORS_STATE_FEATURE),
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
  })),
);
