import {
  EnvironmentProviders,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';
import { BrowserInfo } from '@core/models';

export abstract class BrowserDetectorPort {
  abstract getInfo(): BrowserInfo;
}

export const provideBrowserDetector = (
  useExisting: Type<BrowserDetectorPort>,
): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: BrowserDetectorPort, useExisting }]);
