import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { NotificationData } from '@ui/models';

export type ProgressNotificationData = NotificationData<{
  message: Signal<string>;
  progress?: Signal<number>;
}>;

@Component({
  selector: 'app-progress-notification',
  imports: [],
  template: `<p>{{ data.message() }}</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressNotification {
  protected readonly data =
    inject<ProgressNotificationData>(MAT_SNACK_BAR_DATA);
}
