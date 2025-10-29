import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoutePath } from '@app/app.routes';
import { TabButton } from '@shared/ui';

@Component({
  selector: 'app-operation-mode',
  imports: [TabButton, RouterLink],
  template: `
    <div class="grid">
      <app-tab-button ariaLabel="Text translation" [routerLink]="routePath.TEXT_TRANSLATION">
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
export class OperationMode {
  protected readonly routePath = RoutePath;
}
