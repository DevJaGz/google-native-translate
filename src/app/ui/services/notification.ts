import { inject, Injectable, InjectionToken, Type } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { NotificationData } from '@ui/models';

export type NotificationOptions = {
  duration?: number;
};

export type ConfigMessage = Prettify<
  {
    message: string;
  } & NotificationOptions
>;

export type ConfigCustomMessage<TComponent, TData extends object> = Prettify<
  {
    component: Type<TComponent>;
    data?: NotificationData<TData>;
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
      panelClass: ['error-notification'],
    });
  }

  infoComponent<TComponent, TData extends object>(
    config: ConfigCustomMessage<TComponent, TData>,
  ): MatSnackBarRef<TComponent> {
    return this.#snackBar.openFromComponent<
      TComponent,
      NotificationData<TData>
    >(config.component, {
      data: {
        severity: 'info',
        ...config.data,
      } as NotificationData<TData>,
      duration: config.duration ?? this.#options.duration,
      panelClass: ['info-notification'],
    });
  }
}
