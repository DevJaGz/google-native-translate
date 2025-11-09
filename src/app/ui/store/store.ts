import { computed, inject, InjectionToken } from '@angular/core';
import { Language } from '@core/models';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { LocalXHelper } from '@shared/helpers';
import {
  AUTO_DETECT_LANGUAGE_CODE,
  AUTO_DETECT_LANGUAGE_NAME,
} from '@ui/constants';

export type State = {
  sidenav: {
    isOpen: boolean;
  };
  sourceText: string;
  translatedText: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  languageDetectedCode: string;
  isLoading: boolean;
  hasBrowserSupport: boolean;
};

export const initialState: State = {
  sidenav: {
    isOpen: false,
  },
  sourceText: '',
  translatedText: '',
  sourceLanguageCode: '',
  targetLanguageCode: 'en',
  languageDetectedCode: AUTO_DETECT_LANGUAGE_CODE,
  isLoading: false,
  hasBrowserSupport: true,
};

export const INITIAL_STATE = new InjectionToken<State>('Initial State', {
  providedIn: 'root',
  factory: () => initialState,
});

export const Store = signalStore(
  { providedIn: 'root' },
  withState<State>(() => inject(INITIAL_STATE)),
  withComputed(
    (
      { languageDetectedCode, sourceLanguageCode, targetLanguageCode },
      localX = inject(LocalXHelper),
    ) => ({
      languageDetectedName: computed<string>(() => {
        const code = languageDetectedCode();
        if (code === AUTO_DETECT_LANGUAGE_CODE) {
          return AUTO_DETECT_LANGUAGE_NAME;
        }
        return localX.languageNameIn('en').of(code) ?? '';
      }),
      sourceLanguageName: computed<string>(() => {
        const code = sourceLanguageCode();
        return code ? (localX.languageNameIn('en').of(code) ?? '') : '';
      }),
      targetLanguageName: computed<string>(() => {
        const code = targetLanguageCode();
        return code ? (localX.languageNameIn('en').of(code) ?? '') : '';
      }),
      isAutoDetect: computed<boolean>(
        () => sourceLanguageCode() === AUTO_DETECT_LANGUAGE_CODE,
      ),
    }),
  ),
  withMethods((store) => ({
    patchState(newState: Partial<State>) {
      patchState(store, (state) => ({
        ...state,
        ...newState,
        sidenav: { ...state.sidenav, ...newState.sidenav },
      }));
    },
  })),
);
