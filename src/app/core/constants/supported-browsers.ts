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
      {
        name: 'Opera',
        majorVersion: 122,
      },
    ],
  },
);
