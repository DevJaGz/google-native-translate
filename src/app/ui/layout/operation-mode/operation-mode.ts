import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabButton } from '@shared/ui';

@Component({
  selector: 'app-operation-mode',
  imports: [TabButton],
  template: `
    <div class="grid">
      <app-tab-button ariaLabel="Text translation">
        <ng-container slot="icon">Translate</ng-container>
        <ng-container slot="label">Text</ng-container>
      </app-tab-button>
    </div>
  `,
  styles: ``,
  host: {
    '[style.display]': '"block"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationMode {}
