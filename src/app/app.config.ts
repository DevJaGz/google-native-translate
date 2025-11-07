import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideLanguages, provideLanguageDetector, provideTextTranslator } from '@core/ports';
import { InMemoryLanguagesRepository } from '@data/repositories';
import { BrowserLanguageDetector, BrowserTranslator } from '@data/services';
import { provideDebouncedEvents } from '@ui/services';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideLanguages(InMemoryLanguagesRepository),
    provideLanguageDetector(BrowserLanguageDetector),
    provideTextTranslator(BrowserTranslator),
    provideDebouncedEvents(),
  ],
};
