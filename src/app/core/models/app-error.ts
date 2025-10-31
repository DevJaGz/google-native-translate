export enum ErrorType {
  LANGUAGE_NOT_DETECTED = 'LANGUAGE_NOT_DETECTED',
  LANGUAGE_DETECTION_NOT_SUPPORTED = 'LANGUAGE_DETECTION_NOT_SUPPORTED',
  LANGUAGE_DETECTION_MAX_QUOTA = 'LANGUAGE_DETECTION_MAX_QUOTA',
  LANGUAGE_DETECTION_MIN_QUOTA = 'LANGUAGE_DETECTION_MIN_QUOTA',
  TEXT_TRANSLATION_NOT_SUPPORTED = 'TEXT_TRANSLATION_NOT_SUPPORTED',
  TEXT_TRANSLATION_MAX_QUOTA = 'TEXT_TRANSLATION_MAX_QUOTA',
  TEXT_TRANSLATION_MIN_QUOTA = 'TEXT_TRANSLATION_MIN_QUOTA',
  UNKNOWN = 'UNKNOWN',
}

export type AppErrorData = {
  type: ErrorType;
  message?: string;
  originalError?: unknown;
};

export class AppError extends Error {
  constructor(readonly type: ErrorType, message?: string, readonly originalError?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static create(data: AppErrorData): AppError {
    return new AppError(data.type, data.message, data.originalError);
  }
}
