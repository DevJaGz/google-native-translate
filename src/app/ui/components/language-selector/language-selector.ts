import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
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
      @if (autoDetectLabel()){
        ({{ autoDetectLabel() }})
      }
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelector {
  readonly list = input<Language[]>([]);
  readonly languageCodeSelected = input<string>('');
  readonly handset = input<boolean>(false);
  readonly autoDetectCode = input<string>('und');
  readonly autoDetectLabel = input<string>('');
  readonly #dialog = inject(MatDialog);
  readonly languageSelected = output<Language>();

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
          next: (result) => {
            if (result?.languageSelected) {
              this.languageSelected.emit(result.languageSelected);
            }
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
        maxWidth: '1200px',
        autoFocus: false,
        data: {
          languages: this.list(),
          languageCodeSelected: this.languageCodeSelected(),
          autoDetectCode: this.autoDetectCode(),
          autoDetectLabel: this.autoDetectLabel(),
        },
      })
      .afterClosed();
  }
}
