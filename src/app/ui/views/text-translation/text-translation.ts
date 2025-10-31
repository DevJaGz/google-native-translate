import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckSupportUsecase, ListLanguagesUsecase, TranslateTextUsecase } from '@core/use-cases';

@Component({
  selector: 'app-text-translation',
  imports: [],
  template: `
    <p>
      text-translation works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTranslation {
  readonly #listLanguages = inject(ListLanguagesUsecase);
  readonly #translateText= inject(TranslateTextUsecase);
  readonly #checkSupport = inject(CheckSupportUsecase);
}
