import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckSupportUsecase, ListLanguagesUsecase, TranslateTextUsecase } from '@core/use-cases';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-text-translation',
  imports: [MatInputModule, MatFormFieldModule],
  template: `
    <mat-form-field class="example-full-width" appearance="outline">
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
