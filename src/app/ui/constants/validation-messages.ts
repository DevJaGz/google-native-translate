import { InjectionToken } from '@angular/core';

export const enum ValidationKey {
  REQUIRED = 'required',
  MIN_LENGTH = 'maxlength',
  MAX_LENGTH = 'minlength',
}

export type ValidationDetails = {
  [ValidationKey.MAX_LENGTH]: { maxLength: number };
  [ValidationKey.MIN_LENGTH]: { minLength: number };
};

export type ValidationMessage<TKey> = TKey extends keyof ValidationDetails
  ? (details: ValidationDetails[TKey]) => string
  : string;

export type ValidationMessages = {
  [TKey in ValidationKey]: ValidationMessage<TKey>;
};

export const VALIDATION_MESSAGES = new InjectionToken<ValidationMessages>(
  'Validation messages',
  {
    providedIn: 'root',
    factory: () => ({
      [ValidationKey.REQUIRED]: 'This field is required',
      [ValidationKey.MIN_LENGTH]: (data) =>
        `This field must be at least ${data.minLength} characters long`,
      [ValidationKey.MAX_LENGTH]: (data) =>
        `This field must be at most ${data.maxLength} characters long`,
    }),
  },
);
