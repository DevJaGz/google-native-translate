import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Language } from '@core/models';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AUTO_DETECT_LANGUAGE_NAME } from '@ui/constants';
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
  imports: [
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="px-6 py-4 flex flex-col max-h-full">
      <p class="text-lg font-medium mb-4 text-secondary">Select Language</p>
      <form>
        <mat-form-field
          class="w-full"
          appearance="outline">
          <mat-label>Search for a language</mat-label>
          <input
            id="language-selector-search"
            name="filter"
            type="text"
            placeholder="Write a language name"
            aria-label="Number"
            matInput
            [(ngModel)]="searchedText" />
        </mat-form-field>
      </form>
      <div class="overflow-auto max-h-[80vh]">
        @if (visibleList().length > 0) {
          <div
            class="grid grid-cols-[repeat(auto-fill,minmax(min(170px,100%),1fr))] gap-4 my-2">
            @for (language of visibleList(); track language.code) {
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
                        canDisplayLanguageDetectedName
                      ) {
                        ({{ data.autoDetectLabel }})
                      }
                    </span>
                    @if (language.code === data.autoDetectCode) {
                      <mat-icon class="w-fit! grid!">
                        <span class="material-symbols-outlined ">
                          stars_2
                        </span>
                      </mat-icon>
                    }
                  </div>
                </div>
              </button>
            }
          </div>
        } @else {
          <p>No languages were found for the provided name</p>
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorModal implements AfterViewInit {
  protected readonly data = inject<LanguageSelectorModalData>(DIALOG_DATA);
  readonly canDisplayLanguageDetectedName =
    this.data.autoDetectLabel !== AUTO_DETECT_LANGUAGE_NAME;
  readonly #modalRef = inject(MatDialogRef<LanguageSelectorModal>);

  readonly searchedText = model('');
  readonly visibleList = computed(() => {
    const searchedText = this.searchedText();
    return this.data.languages.filter((language) => {
      return language.name.toLowerCase().includes(searchedText.toLowerCase());
    });
  });

  ngAfterViewInit(): void {
    (document.getElementById('language-selector-search') as HTMLElement)?.focus();
  }

  handleLanguageSelect(language: Language) {
    this.#modalRef.close({
      languageSelected: language,
    });
  }
}
