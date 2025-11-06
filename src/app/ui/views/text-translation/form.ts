import { effect, inject, Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  DETECTION_MIN_QUOTA,
  SOURCE_TEXT_MAX_LENGTH,
  SOURCE_TEXT_MIN_LENGTH,
} from '@core/constants';
import { Store } from '@ui/store';

@Injectable()
export class FormService {
  readonly #store = inject(Store);
  protected readonly translationStore = this.#store.translation;
  protected readonly languageSelectorsStore = this.#store.languageSelectors;

  readonly sourceTextControl = new FormControl('', [
    Validators.required,
    Validators.minLength(SOURCE_TEXT_MIN_LENGTH),
    Validators.maxLength(SOURCE_TEXT_MAX_LENGTH),
  ]);

  constructor() {
    effect(() => {
      const { isLoading } = this.translationStore;
      if (isLoading()) {
        this.sourceTextControl.disable();
      } else {
        this.sourceTextControl.enable();
      }
    });

    effect(() => {
      const { sourceLanguageCodeSelected } = this.languageSelectorsStore;
      const sourceLanguageCode = sourceLanguageCodeSelected();
      if (sourceLanguageCode === '') {
        this.sourceTextControl.removeValidators(
          Validators.minLength(SOURCE_TEXT_MIN_LENGTH),
        );
        this.sourceTextControl.setValidators(
          Validators.minLength(DETECTION_MIN_QUOTA),
        );
      } else {
        this.sourceTextControl.removeValidators(
          Validators.minLength(DETECTION_MIN_QUOTA),
        );
        this.sourceTextControl.setValidators(
          Validators.minLength(SOURCE_TEXT_MIN_LENGTH),
        );
      }
      this.sourceTextControl.updateValueAndValidity();
    });
  }
}
