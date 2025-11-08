import { inject, Injectable, InjectionToken, Type } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

export type NotificationOptions = {
  duration?: number;
};

export type ConfigMessage = Prettify<
  {
    message: string;
  } & NotificationOptions
>;

export type ConfigCustomMessage<C> = Prettify<
  {
    component: Type<C>;
    data?: string;
  } & NotificationOptions
>;

export const NOTIFICATION_OPTIONS = new InjectionToken<NotificationOptions>(
  'Notification Options',
  {
    providedIn: 'root',
    factory: () => ({
      duration: 5000,
    }),
  },
);

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly #snackBar = inject(MatSnackBar);
  readonly #options = inject(NOTIFICATION_OPTIONS);

  error(config: ConfigMessage): MatSnackBarRef<TextOnlySnackBar> {
    return this.#snackBar.open(config.message, undefined, {
      duration: config.duration ?? this.#options.duration,
    });
  }

  infoComponent<C>(config: ConfigCustomMessage<C>): MatSnackBarRef<C> {
    return this.#snackBar.openFromComponent(config.component, {
      data: config.data,
      duration: config.duration ?? this.#options.duration,
    });
  }
}
