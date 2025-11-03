import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  LanguageSelectorModal,
  LanguageSelectorModalData,
  LanguageSelectorModalResult,
} from './language-selector-modal';
import { Language } from '@core/models';
import { tap } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  imports: [MatButtonModule],
  template: `
    <button
      matButton
      class="text-google-sky-blue! rounded-sm!"
      (click)="handleSelection()"
      (keydown.enter)="handleSelection()">
      {{ languageNameSelected() }}
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelector {
  readonly list = input<Language[]>([]);
  readonly languageCodeSelected = input<string>('');
  readonly handset = input<boolean>(false);
  readonly #dialog = inject(MatDialog);

  readonly languageNameSelected = computed(
    () =>
      this.list().find(
        (language) => language.code === this.languageCodeSelected(),
      )?.name ?? '',
  );

  handleSelection() {
    this.openModal()
      .pipe(
        tap({
          next: (selectedLanguage) => {
            console.log(selectedLanguage);
          },
        }),
      )
      .subscribe();
  }

  protected openModal() {
    return this.#dialog
      .open<
        LanguageSelectorModal,
        LanguageSelectorModalData,
        LanguageSelectorModalResult
      >(LanguageSelectorModal, {
        width: '95svw',
        maxWidth: '600px',
        autoFocus: false,
        data: {
          languages: this.list(),
          languageCodeSelected: this.languageCodeSelected(),
        },
      })
      .afterClosed();
  }
}
