import { Injectable } from '@angular/core';
import { BrowserInfo, BrowserName } from '@core/models';
import { BrowserDetectorPort } from '@core/ports';

@Injectable({
  providedIn: 'root',
})
export class BrowserDetector implements BrowserDetectorPort {

  getInfo(): BrowserInfo {
    if (navigator.userAgentData) {
      const uaData = navigator.userAgentData;
      const mobile = uaData.mobile;

      // Find the "main" brand, filtering out generic ones
      const mainBrand = uaData.brands.find(
        (brandData) => !brandData.brand.includes('Chromium') && !brandData.brand.includes('Not'),
      );

      if (mainBrand) {
        const { majorVersion, fullVersion } = this.parseVersion(mainBrand.version);
        const brandName = mainBrand.brand;

        // Map brand name to your BrowserName type
        if (brandName.includes('Microsoft Edge')) {
          return { name: 'Edge', majorVersion, fullVersion };
        }
        if (brandName.includes('Google Chrome')) {
          return {
            name: mobile ? 'Chrome for Android' : 'Chrome',
            majorVersion,
            fullVersion,
          };
        }
        if (brandName.includes('Opera')) {
          return {
            name: mobile ? 'Opera for Android' : 'Opera',
            majorVersion,
            fullVersion,
          };
        }
      }
    }

    // 2. Fallback to legacy navigator.userAgent string parsing
    const ua = navigator.userAgent;
    let match: RegExpExecArray | null;

    // The ORDER of these checks is critical

    // IE
    if (
      (match = /MSIE ([\d.]+)/.exec(ua)) ||
      (match = /Trident\/.*rv:([\d.]+)/.exec(ua))
    ) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      return { name: 'IE', majorVersion, fullVersion };
    }

    // Edge
    if ((match = /Edg\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      return { name: 'Edge', majorVersion, fullVersion };
    }

    // Samsung Internet
    if ((match = /SamsungBrowser\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      return { name: 'Samsung Internet', majorVersion, fullVersion };
    }

    // UC Browser
    if ((match = /UCBrowser\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      return { name: 'UC Browser for Android', majorVersion, fullVersion };
    }

    // QQ Browser
    if ((match = /QQBrowser\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      return { name: 'QQ', majorVersion, fullVersion };
    }

    // Opera
    if ((match = /OPR\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      const name: BrowserName = ua.includes('Android')
        ? 'Opera for Android'
        : 'Opera';
      return { name, majorVersion, fullVersion };
    }

    // KaiOS
    if ((match = /KAIOS\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      return { name: 'KaiOS', majorVersion, fullVersion };
    }

    // Firefox
    if ((match = /Firefox\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      const name: BrowserName = ua.includes('Android')
        ? 'Firefox for Android'
        : 'Firefox';
      return { name, majorVersion, fullVersion };
    }

    // Chrome (must be after Edge, Opera, Samsung, QQ, UC)
    if ((match = /Chrome\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      const name: BrowserName = ua.includes('Android')
        ? 'Chrome for Android'
        : 'Chrome';
      return { name, majorVersion, fullVersion };
    }

    // Android Stock Browser (must be after Chrome)
    if (ua.includes('Android') && (match = /Version\/([\d.]+)/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      return { name: 'Browser for Android', majorVersion, fullVersion };
    }

    // Safari (must be last)
    if ((match = /Version\/([\d.]+).*Safari/.exec(ua))) {
      const { majorVersion, fullVersion } = this.parseVersion(match[1]);
      const name: BrowserName = /iPhone|iPad|iPod/.test(ua)
        ? 'Safari on iOS'
        : 'Safari';
      return { name, majorVersion, fullVersion };
    }

    return { name: 'Unknown', majorVersion: 0, fullVersion: '0.0' };
  }

  protected parseVersion(version: string): Prettify<Omit<BrowserInfo, 'name'>> {
    const major = parseInt(version.split('.')[0], 10);
    return {
      majorVersion: isNaN(major) ? 0 : major,
      fullVersion: version,
    };
  }
}
