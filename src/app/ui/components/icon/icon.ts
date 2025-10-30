import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon',
  imports: [MatIconModule],
  template: `
    <mat-icon class="text-primary! grid!">
      <span class="material-symbols-outlined">
        <ng-content />
      </span>
    </mat-icon>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {}
