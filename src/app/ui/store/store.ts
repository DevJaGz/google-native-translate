import { inject, InjectionToken } from '@angular/core';
import { SidenavStore } from './sidenav';
import { LanguageSelectorsStore } from './language-selectors';
import { TranslationStore } from './translation';

export const Store = new InjectionToken('App Store', {
  providedIn: 'root',
  factory: () => ({
    sidenav: inject(SidenavStore),
    languageSelectors: inject(LanguageSelectorsStore),
    translation: inject(TranslationStore),
  }),
});
