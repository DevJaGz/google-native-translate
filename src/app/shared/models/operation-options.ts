export type AbortOperationOption = {
  abortSignal?: AbortSignal;
};

export type SupportedLanguagesOption = { supportedLanguageCodes?: string[] };

export type MonitorProgressOption<TParams = ProgressEvent> = {
  monitor?: (params: TParams) => void;
};
