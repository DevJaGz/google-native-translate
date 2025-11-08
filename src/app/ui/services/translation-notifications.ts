import { inject, Injectable } from '@angular/core';
import { Store } from '@ui/store';
import { NotificationService } from './notification';

@Injectable({
  providedIn: 'root',
})
export class TranslationNotificationsService {
  readonly #notificationService = inject(NotificationService);
  readonly #store = inject(Store);

  handleDetectorProgressNotification(event: ProgressEvent) {}

  handleTranslatorProgressNotification(event: ProgressEvent) {}
}
