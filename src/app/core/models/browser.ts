export type BrowserName =
  | 'Chrome'
  | 'Chrome for Android'
  | 'Edge'
  | 'Safari'
  | 'Safari on iOS'
  | 'Firefox'
  | 'Firefox for Android'
  | 'Opera'
  | 'Opera for Android'
  | 'IE'
  | 'Samsung Internet'
  | 'UC Browser for Android'
  | 'Browser for Android'
  | 'QQ'
  | 'KaiOS'
  | 'Unknown';

export type BrowserInfo = {
  name: BrowserName;
  majorVersion: number;
  fullVersion?: string;
};
