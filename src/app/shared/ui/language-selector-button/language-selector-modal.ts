import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-language-selector-modal',
  imports: [],
  template: `
    <div class="p-4">
      <p class="text-lg font-medium mb-4">Select Language</p>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorModal {
  languageList = signal([]);
}
