import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CheckSupportUsecase, ListLanguagesUsecase, TranslateTextUsecase } from '@core/use-cases';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AppError } from '@core/models';

@Component({
  selector: 'app-text-translation',
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, JsonPipe],
  template: `
    <div>Available Languages:</div>
    <button matButton mat-raised-button color="primary" (click)="translate()">Translate</button>
    <mat-form-field class="w-full max-w-xl min-h-48">
      <mat-label>Leave a comment</mat-label>
      <textarea matInput placeholder="Ex. It makes me feel..."></textarea>
    </mat-form-field>
    <pre>{{ listLanguages.value() | json }}</pre>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTranslation {
  readonly #listLanguages = inject(ListLanguagesUsecase);
  readonly #translateText = inject(TranslateTextUsecase);
  readonly #checkSupport = inject(CheckSupportUsecase);

  readonly listLanguages = rxResource({
    stream: () => this.#listLanguages.execute(),
    defaultValue: [],
  });

  constructor() {
    effect((onCleanup) => {
      if (this.listLanguages.error()) {
        alert(`Error loading languages: ${this.listLanguages.error()}`);
        return;
      }
      const languages = this.listLanguages.value();
      if (languages.length === 0) {
        return;
      }
      const [source, target] = languages;

      if (!source || !target) {
        console.warn('Not enough languages available to perform translation.', source, target);
        return;
      }

      const subs = this.#checkSupport
        .execute({
          sourceLanguageCode: source.code,
          targetLanguageCode: target.code,
        })
        .subscribe({
          next: (isSupported) => {
            if (!isSupported) {
              alert(`Translation from ${source.name} to ${target.name} is not supported.`);
              return;
            }
            console.log('Translation is supported. Proceeding to translate sample text.');
          },
        });

      onCleanup(() => subs.unsubscribe());
    });
  }

  translate() {
    this.#translateText
      .execute({
        sourceLanguageCode: 'es',
        targetLanguageCode: 'en',
        text: 'Me encanta programar en Angular porque es muy versátil y potente.',
        detection: {
          monitor: (progress) => {
            console.log(`Detection loaded:`, progress.loaded, ', out of:', progress.total);
          },
        },
        translation: {
          monitor: (progress) => {
            console.log(`Translation loaded:`, progress.loaded, ', out of:', progress.total);
          },
        },
      })
      .subscribe({
        next: (translatedText) => {
          alert(`Translated Text: ${JSON.stringify(translatedText)}`);
        },
        error: (err) => {
          console.error(err);
          console.error(err instanceof AppError ? err.type : null);
        },
      });
  }
}
