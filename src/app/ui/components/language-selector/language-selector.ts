import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LanguageSelectorModal } from './language-selector-modal';

@Component({
  selector: 'app-language-selector',
  imports: [MatButtonModule],
  template: `
      <button
        matButton
        class="text-google-sky-blue! rounded-sm!">
        Spanish
      </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelector {
  readonly handset = input<boolean>(false);
  readonly #dialog = inject(MatDialog);

  openDialog() {
    this.#dialog.open(LanguageSelectorModal, {
      width: '95svw',
      maxWidth: '600px',
    });
  }
}
