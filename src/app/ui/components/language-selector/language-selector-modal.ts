import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Language } from '@core/models';

export type LanguageSelectorModalData = {
  languages: Language[];
  languageCodeSelected?: string;
  autoDetectCode?: string;
  autoDetectLabel?: string;
};

export type LanguageSelectorModalResult =
  | undefined
  | {
      languageSelected: Language;
    };

@Component({
  selector: 'app-language-selector-modal',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="px-6 py-4">
      <p class="text-lg font-medium mb-4 text-secondary">Select Language</p>
      <div class="overflow-auto max-h-[80vh]">
        <div
          class="grid grid-cols-[repeat(auto-fill,minmax(min(170px,100%),1fr))] gap-4 my-2">
          @for (language of data.languages; track $index) {
            <button
              matButton
              class="py-6! hover:bg-surface-secondary! rounded-md! cursor-pointer!"
              [attr.data-selected]="
                language.code === data.languageCodeSelected ? '' : null
              "
              (click)="handleLanguageSelect(language)"
              (keydown.enter)="handleLanguageSelect(language)">
              <div
                class="flex items-center gap-1"
                [class]="
                  language.code === data.languageCodeSelected
                    ? 'text-google-sky-blue'
                    : 'text-primary'
                ">
                @if (language.code === data.languageCodeSelected) {
                  <mat-icon class="w-fit! grid!">
                    <span class="material-symbols-outlined "> Check </span>
                  </mat-icon>
                }
                <div class="flex items-center gap-1">
                  <span class="line-clamp-2">
                    {{ language.name }}
                    @if (
                      language.code === data.languageCodeSelected &&
                      data.autoDetectLabel
                    ) {
                      ({{ data.autoDetectLabel }})
                    }
                  </span>
                  @if (language.code === data.autoDetectCode) {
                    <mat-icon class="w-fit! grid!">
                      <span class="material-symbols-outlined "> stars_2 </span>
                    </mat-icon>
                  }
                </div>
              </div>
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
