import { effect, inject, Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  DETECTOR_MIN_QUOTA,
  SOURCE_TEXT_MAX_LENGTH,
  SOURCE_TEXT_MIN_LENGTH,
} from '@core/constants';
import { Store } from '@ui/store';

@Injectable()
export class FormService {
  readonly #store = inject(Store);

  readonly sourceTextControl = new FormControl('', [
    Validators.required,
    Validators.minLength(SOURCE_TEXT_MIN_LENGTH),
    Validators.maxLength(SOURCE_TEXT_MAX_LENGTH),
  ]);

  constructor() {
    effect(() => {
      const isLoading = this.#store.isLoading();
      const hasBrowserSupport = this.#store.hasBrowserSupport();

      if (!hasBrowserSupport) {
        this.sourceTextControl.disable();
        return;
      }

      if (isLoading) {
        this.sourceTextControl.disable();
      } else {
        this.sourceTextControl.enable();
      }
    });

    effect(() => {
      const sourceLanguageCode = this.#store.sourceLanguageCode();
      if (sourceLanguageCode === '') {
        this.sourceTextControl.removeValidators(
          Validators.minLength(SOURCE_TEXT_MIN_LENGTH),
        );
        this.sourceTextControl.setValidators(
          Validators.minLength(DETECTOR_MIN_QUOTA),
        );
      } else {
        this.sourceTextControl.removeValidators(
          Validators.minLength(DETECTOR_MIN_QUOTA),
        );
        this.sourceTextControl.setValidators(
          Validators.minLength(SOURCE_TEXT_MIN_LENGTH),
        );
      }
      this.sourceTextControl.updateValueAndValidity();
    });

    effect(() => {
      const sourceText = this.#store.sourceText();
      const controlText = this.sourceTextControl.value;
      if (sourceText === controlText) {
        return;
      }
      this.sourceTextControl.setValue(sourceText, {
        emitEvent: false,
        onlySelf: true,
      });
    });
  }
}
