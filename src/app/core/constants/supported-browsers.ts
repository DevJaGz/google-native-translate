import { InjectionToken } from '@angular/core';
import { BrowserInfo } from '@core/models';

export const SUPPORTED_BROWSERS = new InjectionToken<BrowserInfo[]>(
  'Supported browsers',
  {
    providedIn: 'root',
    factory: () => [
      {
        name: 'Chrome',
        majorVersion: 138,
      },
      // Opera throws an error when running in the browser: errors.ts:19 Error: An ErrorEvent with no error occurred. See Error.cause for details: Uncaught undefined  at errorListener (root_effect_scheduler.mjs:3675:30)
      // {
      //   name: 'Opera',
      //   majorVersion: 122,
      // },
    ],
  },
);
