import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalXHelper {
  languageNameIn(locales: Intl.LocalesArgument, options?: Omit<Intl.DisplayNamesOptions, 'type'>) {
    return new Intl.DisplayNames(locales, { type: 'language', ...options });
  }
}
