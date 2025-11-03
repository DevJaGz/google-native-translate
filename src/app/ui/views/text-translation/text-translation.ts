import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckSupportUsecase, ListLanguagesUsecase, TranslateTextUsecase } from '@core/use-cases';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-text-translation',
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule],
  template: `
    <mat-form-field class="w-full max-w-xl min-h-48">
      <mat-label>Leave a comment</mat-label>
      <textarea matInput placeholder="Ex. It makes me feel..."></textarea>
    </mat-form-field>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTranslation {
  readonly #listLanguages = inject(ListLanguagesUsecase);
  readonly #translateText = inject(TranslateTextUsecase);
  readonly #checkSupport = inject(CheckSupportUsecase);
}
