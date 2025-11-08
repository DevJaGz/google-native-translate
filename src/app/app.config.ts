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
} from '@core/ports';
import { InMemoryLanguagesRepository } from '@data/repositories';
import { BrowserLanguageDetector, BrowserTranslator } from '@data/services';
import { provideCustomErrors, provideDebouncedEvents } from '@ui/services';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideCustomErrors(),
    provideLanguages(InMemoryLanguagesRepository),
    provideLanguageDetector(BrowserLanguageDetector),
    provideTextTranslator(BrowserTranslator),
    provideDebouncedEvents(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
};
