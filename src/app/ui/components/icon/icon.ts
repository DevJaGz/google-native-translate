import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon',
  imports: [MatIconModule],
  template: `
    <mat-icon class="text-primary! grid!" [style.width.px]="size()" [style.height.px]="size()">
      <span class="material-symbols-outlined" [style.font-size.px]="size()">
        <ng-content />
      </span>
    </mat-icon>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  size = input<number>(24);
}
