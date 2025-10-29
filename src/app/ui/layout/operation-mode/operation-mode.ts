import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-operation-mode',
  imports: [MatButtonModule,  MatIconModule],
  template: `
    <div class="grid">
      <button matButton="outlined" aria-label="Text translation" class="w-fit">
        <mat-icon class="grid! text-google-blue!">
          <span class="material-symbols-outlined">
           Translate
          </span>
        </mat-icon>
        Basic
      </button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationMode {}
