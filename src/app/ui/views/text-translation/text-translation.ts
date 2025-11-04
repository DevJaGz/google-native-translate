import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateTextUsecase } from '@core/use-cases';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ui/store';
import { LocalXHelper, TimingHelper } from '@shared/helpers';
import { Subject, takeUntil, tap } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

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
      <mat-form-field class="w-full max-w-xl min-h-48">
        <mat-label>Leave a comment</mat-label>
        <textarea
          matInput
          [formControl]="sourceTextControl"
          (keydown)="debounceTranslateText()"
          rows="8"
          placeholder="Ex. It makes me feel..."></textarea>
      </mat-form-field>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTranslation {
  readonly #translateText = inject(TranslateTextUsecase);
  readonly #timingHelper = inject(TimingHelper);
  readonly #localXHelper = inject(LocalXHelper);
  readonly #snackBar = inject(MatSnackBar);
  protected readonly store = inject(Store);
  protected readonly translateStore = this.store.translation;
  protected readonly languageSelectorsStore = this.store.languageSelectors;

  protected readonly translationReset$ = new Subject<void>();
  protected readonly debounce = this.#timingHelper.debounce(300);
  protected readonly sourceTextControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(5000),
  ]);

  protected snackbarRef: MatSnackBarRef<TextOnlySnackBar> | null = null;

  constructor() {
    effect(() => {
      const { isLoading } = this.translateStore;
      if (isLoading()) {
        this.sourceTextControl.disable();
      } else {
        this.sourceTextControl.enable();
      }
    });
  }

  protected debounceTranslateText() {
    if (!this.sourceTextControl.value || !this.sourceTextControl.valid) {
      return;
    }
    this.debounce(this.handlingTranlation.bind(this));
  }

  protected handlingTranlation() {
    const { setIsLoading } = this.translateStore;
    setIsLoading(true);
    this.translationReset$.next();

    const monitor = (event: MonitorProgressEvent) => {
      this.notifyProgress(event);
    };

    this.executeTranslation(monitor)
      .pipe(
        takeUntil(this.translationReset$),
        tap({
          next: (translation) => {
            console.log('translation', translation);
          },
          error: (error) => {
            console.error('Translation error', error);
            setIsLoading(false);
          },
          complete: () => {
            setIsLoading(false);
          },
        }),
      )
      .subscribe();
  }

  protected executeTranslation(
    monitorProgress?: (param: MonitorProgressEvent) => void,
  ) {
    const text = this.sourceTextControl.value!;

    const { sourceLanguageCodeSelected, targetLanguageCodeSelected } =
      this.languageSelectorsStore;

    const sourceLanguageCode = sourceLanguageCodeSelected();
    const targetLanguageCode = targetLanguageCodeSelected();

    return this.#translateText.execute({
      text,
      sourceLanguageCode,
      targetLanguageCode,
      detection: {
        monitor: (event) => {
          monitorProgress?.({
            type: 'detector',
            loaded: event.loaded,
            total: event.total,
          });
        },
      },
      translation: {
        monitor: (event) => {
          monitorProgress?.({
            type: 'translator',
            loaded: event.loaded,
            total: event.total,
          });
        },
      },
    });
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

    const sourceLanguageName = this.#localXHelper.languageNameIn('en').of(sourceLanguageCode);
    const targetLanguageName = this.#localXHelper.languageNameIn('en').of(targetLanguageCode);
    const doneMessage = `A ${contextLabel} model for "${sourceLanguageName}" to "${targetLanguageName}" has been downloaded successfully.`;
    const message =
      event.loaded === event.total ? doneMessage : progressMessage;
    this.displayMessageToUser(message);
  }

  protected displayMessageToUser(message: string) {
    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
      this.snackbarRef = null;
    }
    this.snackbarRef = this.#snackBar.open(message, undefined, {
      duration: 5000,
    });
  }
}
