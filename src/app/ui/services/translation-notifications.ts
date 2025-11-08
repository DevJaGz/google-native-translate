import { inject, Injectable, signal, Signal } from '@angular/core';
import { Store } from '@ui/store';
import { NotificationService } from './notification';
import { ProgressNotification, ProgressNotificationData } from '@ui/components';

@Injectable({
  providedIn: 'root',
})
export class TranslationNotificationsService {
  readonly #notificationService = inject(NotificationService);
  readonly #store = inject(Store);
  protected isDetectorInProgress = false;
  protected isTranslatorInProgress = false;
  protected detectorMessage = signal<string>('');
  protected translatorMessage = signal<string>('');

  handleDetectorProgressNotification(event: ProgressEvent) {
    const total = event.total;
    const loaded = event.loaded;

    if (this.isDetectorInProgress && total === loaded) {
      this.detectorMessage.set(
        `A detection model was downloaded successfully.`,
      );
      this.isDetectorInProgress = false;
      return;
    } else {
      this.detectorMessage.set(
        `A detection model is being downloading... ${(loaded * 100).toFixed(2)}%`,
      );
    }

    if (this.isDetectorInProgress) {
      return;
    }

    this.isDetectorInProgress = true;
    this.notifyProgress(this.detectorMessage.asReadonly());
  }

  handleTranslatorProgressNotification(event: ProgressEvent) {
    const total = event.total;
    const loaded = event.loaded;
    const sourceLanguageName = this.#store.sourceLanguageName();
    const targetLanguageName = this.#store.targetLanguageName();

    if (this.isTranslatorInProgress && total === loaded) {
      this.translatorMessage.set(
        `A translation model for "${sourceLanguageName}" to "${targetLanguageName}" was downloaded successfully.`,
      );
      this.isTranslatorInProgress = false;
      return;
    } else {
      this.translatorMessage.set(
        `A translation model is being downloading... ${(loaded * 100).toFixed(2)}%`,
      );
    }

    if (this.isTranslatorInProgress) {
      return;
    }

    this.isTranslatorInProgress = true;
    this.notifyProgress(this.translatorMessage.asReadonly());
  }

  protected notifyProgress(message: Signal<string>, progress?: Signal<number>) {
    this.#notificationService.infoComponent<
      ProgressNotification,
      ProgressNotificationData
    >({
      component: ProgressNotification,
      data: {
        message,
        progress,
      },
    });
  }
}
