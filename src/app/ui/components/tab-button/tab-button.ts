import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tab-button',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button
      matButton="outlined"
      class="w-fit mat-tab-button border! bg-google-blue-1f!"
      [attr.aria-label]="ariaLabel()"
    >
      <mat-icon class="text-google-mid-blue! w-fit! grid! ">
        <span class="material-symbols-outlined text-xl!">
          <ng-content select="[slot='icon']" />
        </span>
      </mat-icon>
      <strong class="text-google-mid-blue font-medium">
        <ng-content select="[slot='label']" />
      </strong>
    </button>
  `,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabButton {
  readonly ariaLabel = input('Tab button');
}
