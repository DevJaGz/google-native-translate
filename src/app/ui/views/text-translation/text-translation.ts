import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateTextUsecase } from '@core/use-cases';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ui/store';
import { TimingHelper } from '@shared/helpers';
import { Subject, takeUntil, tap } from 'rxjs';

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
  protected readonly store = inject(Store);

  protected readonly translationReset$ = new Subject<void>();
  protected readonly debounce = this.#timingHelper.debounce(300);
  protected readonly sourceTextControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(5000),
  ]);

  protected debounceTranslateText() {
    if (!this.sourceTextControl.value || !this.sourceTextControl.valid) {
      return;
    }
    this.debounce(this.handlingTranlation.bind(this));
  }

  protected handlingTranlation() {
    this.translationReset$.next();

    const monitor = (event: MonitorProgressEvent) => {
      console.log('Dowloading model...', event.loaded, '/', event.total);
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
          },
        }),
      )
      .subscribe();
  }

  protected executeTranslation(
    monitorProgress?: (param: MonitorProgressEvent) => void,
  ) {
    const text = this.sourceTextControl.value!;
    const languageSelectors = this.store.languageSelectors;
    const sourceLanguageCode = languageSelectors.sourceLanguageCodeSelected();
    const targetLanguageCode = languageSelectors.targetLanguageCodeSelected();

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
}
