import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LanguageSelectorModal } from './language-selector-modal';
import { MatTabsModule } from '@angular/material/tabs';
import { IconButton } from '../icon-button/icon-button';

@Component({
  selector: 'app-language-selector-button',
  imports: [MatButtonModule, MatTabsModule, IconButton],
  template: `
    <div class="flex items-center">
      <div>
        <nav mat-tab-nav-bar [tabPanel]="tabPanel">
          <a mat-tab-link active>Uno</a>
          <a mat-tab-link>Dos</a>
        </nav>
        <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
      </div>
      <app-icon-button> keyboard_arrow_down </app-icon-button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorButton {
  readonly #dialog = inject(MatDialog);

  openDialog() {
    this.#dialog.open(LanguageSelectorModal, {
      width: '95svw',
      maxWidth: '600px',
    });
  }
}
