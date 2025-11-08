import { inject, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ValidationMessagesService } from '@ui/services';

@Pipe({
  name: 'formErrorMessage',
})
export class FormErrorMessagePipe implements PipeTransform {
  readonly #validationMessagesService = inject(ValidationMessagesService);

  transform(formErrors: ValidationErrors | null | undefined): string {
    return this.#validationMessagesService.handleFormError(formErrors);
  }
}
