export enum ErrorType {
  INSUFFICIENT_QUOTA = 'INSUFFICIENT_QUOTA',
  LANGUAGE_NOT_DETECTED = 'LANGUAGE_NOT_DETECTED',
  LANGUAGE_DETECTION_NOT_SUPPORTED = 'LANGUAGE_DETECTION_NOT_SUPPORTED',
  TEXT_TRANSLATION_NOT_SUPPORTED = 'TEXT_TRANSLATION_NOT_SUPPORTED',
  UNKNOWN = 'UNKNOWN',
}

export type AppErrorData = {
  type: ErrorType;
  message?: string;
  originalError?: unknown;
};

export class AppError extends Error {
  constructor(data: AppErrorData) {
    super(data.message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static create(data: AppErrorData): AppError {
    return new AppError(data);
  }
}
