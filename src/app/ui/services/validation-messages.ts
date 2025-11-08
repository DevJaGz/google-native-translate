import { inject, Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { VALIDATION_MESSAGES, ValidationKey } from '@ui/constants';

@Injectable({
  providedIn: 'root',
})
export class ValidationMessagesService {
  readonly #messages = inject(VALIDATION_MESSAGES);

  handleFormError(formErrors: ValidationErrors | null | undefined): string {
    if (!formErrors) {
      return '';
    }

    const [first] = Object.entries(formErrors);
    if (!first) {
      return '';
    }

    const [key, details] = first;
    const template = this.#messages[key as ValidationKey];
    if (!template) {
      return '';
    }

    if (typeof template === 'string') {
      return template;
    }

    return template(details);
  }
}
