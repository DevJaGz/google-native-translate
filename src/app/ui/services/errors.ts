import {
  ErrorHandler,
  inject,
  Injectable,
  isDevMode,
  makeEnvironmentProviders,
} from '@angular/core';
import { AppError } from '@core/models';
import { NotificationService } from './notification';
import { ERROR_MESSAGES } from '@ui/constants';

@Injectable()
export class ErrorsService implements ErrorHandler {
  readonly #notificationService = inject(NotificationService);
  readonly #errorMessages = inject(ERROR_MESSAGES);

  handleError(error: unknown): void {
    if (isDevMode()) {
      console.error(error);
    }

    if (error instanceof AppError) {
      const message = this.#errorMessages[error.type];
      this.#notificationService.info(message);
      return;
    }
  }
}

export const provideCustomErrors = () =>
  makeEnvironmentProviders([
    {
      provide: ErrorHandler,
      useClass: ErrorsService,
    },
  ]);
