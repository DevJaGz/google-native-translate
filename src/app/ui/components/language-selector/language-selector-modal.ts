import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Language } from '@core/models';

export type LanguageSelectorModalData = {
  languages: Language[];
  languageCodeSelected?: string;
};

export type LanguageSelectorModalResult =
  | undefined
  | {
      languageSelected: Language;
    };

@Component({
  selector: 'app-language-selector-modal',
  imports: [MatButtonModule],
  template: `
    <div class="px-6 py-4">
      <p class="text-lg font-medium mb-4 text-secondary">Select Language</p>
      <div class="overflow-auto max-h-[80vh]">
        <div
          class="grid grid-cols-[repeat(auto-fill,minmax(min(100px,100%),1fr))] gap-4 my-2">
          @for (language of data.languages; track $index) {
            <button
              matButton
              class="p-2 hover:bg-surface-secondary! rounded-md! cursor-pointer!"
              [attr.data-selected]="
                language.code === data.languageCodeSelected ? '' : null
              "
              (click)="handleLanguageSelect(language)"
              (keydown.enter)="handleLanguageSelect(language)">
              <span
                [class]="
                  language.code === data.languageCodeSelected
                    ? 'text-google-sky-blue'
                    : 'text-primary'
                ">
                {{ language.name }}
              </span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorModal implements AfterViewInit {
  protected readonly data = inject<LanguageSelectorModalData>(DIALOG_DATA);
  readonly #modalRef = inject(MatDialogRef<LanguageSelectorModal>);

  ngAfterViewInit(): void {
    (document.querySelector('[data-selected]') as HTMLElement)?.focus();
  }

  handleLanguageSelect(language: Language) {
    this.#modalRef.close({
      languageSelected: language,
    });
  }
}
