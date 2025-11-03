import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LanguageSelectorModal } from './language-selector-modal';

@Component({
  selector: 'app-language-selector-button',
  imports: [MatButtonModule],
  template: ` <button matButton (click)="openDialog()" (keydown.enter)="openDialog()" ><span class="tracking-[0.25px] font-medium text-base text-google-sky-blue">Basic</span></button> `,
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
