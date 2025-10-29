import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-operation-mode',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="grid">
      <button matButton="outlined" aria-label="Text translation" class="w-fit mat-tab-button border! bg-google-blue-1f!">
        <mat-icon class="text-google-mid-blue! w-fit! grid! ">
          <span class="material-symbols-outlined text-xl!"> Translate </span>
        </mat-icon>
        <strong class="text-google-mid-blue font-medium">Text</strong>
      </button>
    </div>
  `,
  styles: ``,
  host: {
    'style': 'display:block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationMode {}
