import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly #snackBar = inject(MatSnackBar);

  info(message: string): MatSnackBarRef<TextOnlySnackBar> {
    return this.#snackBar.open(message, undefined, {
      duration: 5000,
    });
  }
}
