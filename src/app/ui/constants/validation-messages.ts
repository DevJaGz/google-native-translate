import { InjectionToken } from '@angular/core';

export const enum ValidationKey {
  REQUIRED = 'required',
  MIN_LENGTH = 'maxlength',
  MAX_LENGTH = 'minlength',
}

export type ValidationDetails = {
  [ValidationKey.MAX_LENGTH]: { requiredLength: number };
  [ValidationKey.MIN_LENGTH]: { requiredLength: number };
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
        `This field must be at least ${data.requiredLength} characters long`,
      [ValidationKey.MAX_LENGTH]: (data) =>
        `This field must be at most ${data.requiredLength} characters long`,
    }),
  },
);
