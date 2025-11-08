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
  ],
  template: `
    <form>
      <mat-form-field class="w-full max-w-xl min-h-48" appearance="outline">
        <mat-label>Leave a comment</mat-label>
        <textarea
          #sourceTextControlRef
          matInput
          [formControl]="sourceTextControl"
          (input.debounce.400ms)="translate()"
          rows="8"
          placeholder="Ex. It makes me feel..."></textarea>
      </mat-form-field>
      <output class="text-2xl p-2 outline outline-primary block rounded">
        @if (
          translationStore.isLoading() &&
          translationStore.translatedText() === ''
        ) {
          Translating...
        } @else if (translationStore.translatedText() === '') {
          Translation
        } @else {
          {{ translationStore.translatedText() }}
        }
      </output>
    </form>
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
  readonly #store = inject(Store);

  protected readonly sourceTextControlRef = viewChild.required<
    ElementRef<HTMLTextAreaElement>
  >('sourceTextControlRef');

  protected readonly translationStore = this.#store.translation;
  protected readonly languageSelectorsStore = this.#store.languageSelectors;
  protected readonly sourceTextControl = this.#formService.sourceTextControl;

  protected snackbarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;

  constructor() {
    effect(() => {
      const { isLoading } = this.translationStore;
      const sourceElement = this.sourceTextControlRef().nativeElement;
      if (isLoading()) {
        this.sourceTextControl.disable();
      } else {
        this.sourceTextControl.enable();
        sourceElement.focus();
      }
    });
  }

  protected translate() {
    const { patchState } = this.translationStore;
    if (!this.sourceTextControl.value || !this.sourceTextControl.valid) {
      patchState({
        translatedText: '',
        sourceText: '',
      });
      return;
    }
    this.#textTranslationService.translate(this.sourceTextControl.value);
  }

  protected notifyProgress(event: MonitorProgressEvent) {
    const { sourceLanguageCodeSelected, targetLanguageCodeSelected } =
      this.languageSelectorsStore;

    const sourceLanguageCode = sourceLanguageCodeSelected();
    const targetLanguageCode = targetLanguageCodeSelected();

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
    const { setLanguageDetectedName } = this.languageSelectorsStore;
    if (sourceLanguageCode === translation.sourceLanguageCode) {
      setLanguageDetectedName('');
    } else {
      const name =
        this.#localXHelper
          .languageNameIn('en')
          .of(translation.sourceLanguageCode) ?? '';
      setLanguageDetectedName(name);
    }
  }
}
