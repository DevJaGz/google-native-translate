import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ui/store';
import { TranslationText } from '@core/models';
import { FormService } from './form';
import { TextTranslationService } from '@ui/services';
import { AUTO_DETECT_LANGUAGE_CODE } from '@ui/constants';
import { FormErrorMessagePipe } from '@ui/pipes';

type MonitorProgressEvent = {
  type: 'detector' | 'translator';
  loaded: number;
  total: number;
};

@Component({
  selector: 'app-text-translation',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormErrorMessagePipe,
  ],
  template: `
    <div
      class="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
      <form>
        <mat-form-field
          class="w-full max-w-xl min-h-48"
          appearance="outline">
          <mat-label>Text</mat-label>
          <textarea
            #sourceTextControlRef
            matInput
            [formControl]="sourceTextControl"
            (input.debounce.400ms)="translate()"
            rows="8"
            placeholder="Write the text you want to translate"></textarea>
        </mat-form-field>
        @if (sourceTextControl.errors) {
          <mat-error>{{
            sourceTextControl.errors | formErrorMessage
          }}</mat-error>
        }
      </form>
      <output class="text-2xl p-3 bg-google-gray-blue rounded-lg">
        @if (store.isLoading() && store.translatedText() === '') {
          Translating...
        } @else if (store.translatedText() === '') {
          Translation
        } @else {
          {{ store.translatedText() }}
        }
      </output>
    </div>
  `,
  styles: ``,
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTranslation {
  readonly #textTranslationService = inject(TextTranslationService);
  readonly #formService = inject(FormService);
  protected readonly store = inject(Store);

  protected readonly sourceTextControlRef = viewChild.required<
    ElementRef<HTMLTextAreaElement>
  >('sourceTextControlRef');

  protected readonly sourceTextControl = this.#formService.sourceTextControl;

  constructor() {
    effect(() => {
      const isLoading = this.store.isLoading();
      const sourceElement = this.sourceTextControlRef().nativeElement;
      if (!isLoading) {
        sourceElement.focus();
      }
    });
  }

  protected translate() {
    if (!this.sourceTextControl.value || !this.sourceTextControl.valid) {
      this.store.patchState({
        translatedText: '',
        sourceText: '',
      });
      return;
    }
    this.#textTranslationService.translate(this.sourceTextControl.value);
  }

  protected handleLanguageDetectionLabel(
    translation: TranslationText,
    sourceLanguageCode: string,
  ): void {
    this.store.patchState({
      languageDetectedCode:
        sourceLanguageCode === translation.sourceLanguageCode
          ? AUTO_DETECT_LANGUAGE_CODE
          : translation.sourceLanguageCode,
    });
  }
}
