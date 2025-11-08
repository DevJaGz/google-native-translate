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
import { LocalXHelper } from '@shared/helpers';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
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
    FormErrorMessagePipe
  ],
  template: `
    <div
      class="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-x-4 gap-y-0">
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
        <mat-error>{{ sourceTextControl.errors | formErrorMessage }}</mat-error>
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
  readonly #localXHelper = inject(LocalXHelper);
  readonly #snackBar = inject(MatSnackBar);
  protected readonly store = inject(Store);

  protected readonly sourceTextControlRef = viewChild.required<
    ElementRef<HTMLTextAreaElement>
  >('sourceTextControlRef');

  protected readonly sourceTextControl = this.#formService.sourceTextControl;

  protected snackbarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;

  constructor() {
    effect(() => {
      const isLoading = this.store.isLoading();
      const sourceElement = this.sourceTextControlRef().nativeElement;
      if (isLoading) {
        this.sourceTextControl.disable();
      } else {
        this.sourceTextControl.enable();
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

  protected notifyProgress(event: MonitorProgressEvent) {
    const sourceLanguageCode = this.store.sourceLanguageCode();
    const targetLanguageCode = this.store.targetLanguageCode();

    const contextLabel =
      event.type === 'detector' ? 'Detecting language' : 'Translating text';
    const progressMessage = `A model is being downloaded for ${
      contextLabel
    } (${Math.floor((event.loaded / event.total) * 100)}%), please wait...`;

    const sourceLanguageName = this.#localXHelper
      .languageNameIn('en')
      .of(sourceLanguageCode);
    const targetLanguageName = this.#localXHelper
      .languageNameIn('en')
      .of(targetLanguageCode);
    const doneMessage = `A ${contextLabel} model for "${sourceLanguageName}" to "${targetLanguageName}" has been downloaded successfully.`;
    const message =
      event.loaded === event.total ? doneMessage : progressMessage;
    this.displayMessageToUser(message);
  }

  protected displayMessageToUser(message: string): void {
    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
      this.snackbarRef = null;
    }
    this.snackbarRef = this.#snackBar.open(message, undefined, {
      duration: 5000,
    });
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
