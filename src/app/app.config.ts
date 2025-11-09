import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideLanguages,
  provideLanguageDetector,
  provideTextTranslator,
  provideBrowserDetector,
} from '@core/ports';
import { InMemoryLanguagesRepository } from '@data/repositories';
import { BrowserDetector, BrowserLanguageDetector, BrowserTranslator } from '@data/services';
import { provideCustomErrors, provideDebouncedEvents } from '@ui/services';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideCustomErrors(),
    provideDebouncedEvents(),
    provideLanguages(InMemoryLanguagesRepository),
    provideLanguageDetector(BrowserLanguageDetector),
    provideTextTranslator(BrowserTranslator),
    provideBrowserDetector(BrowserDetector),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
};
