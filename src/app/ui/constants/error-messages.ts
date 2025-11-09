import { InjectionToken } from '@angular/core';
import { ErrorType } from '@core/models';

export const ERROR_MESSAGES = new InjectionToken<Record<ErrorType, string>>('', {
  providedIn: 'root',
  factory: () => ({
    [ErrorType.UNKNOWN]:
      'Sorry, something went wrong. Please try again later.',
    [ErrorType.LANGUAGE_DETECTION_MAX_QUOTA]:
      'The provided text is too long to be detected.',
    [ErrorType.LANGUAGE_DETECTION_MIN_QUOTA]:
      'The provided text is too short to be detected.',
    [ErrorType.LANGUAGE_DETECTION_NOT_SUPPORTED]:
      'Sorry, the language detection model is not supported by your browser.',
    [ErrorType.LANGUAGE_NOT_DETECTED]:
      'Sorry, the language could not be detected.',
    [ErrorType.TEXT_TRANSLATION_MAX_QUOTA]:
      'The provided text is too long to be translated.',
    [ErrorType.TEXT_TRANSLATION_MIN_QUOTA]:
      'The provided text is too short to be translated.',
    [ErrorType.TEXT_TRANSLATION_NOT_SUPPORTED]:
      'Sorry, the translation model is not supported by your browser.',
    [ErrorType.BROWSER_NOT_SUPPORTED]: 'Sorry, your browser is not supported.',
  }),
});
