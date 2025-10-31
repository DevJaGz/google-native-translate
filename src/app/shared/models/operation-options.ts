export type AbortOperationOption = {
  abortSignal?: AbortSignal;
};

export type SupportedLanguagesOption = { supportedLanguageCodes?: string[] };

export type MonitorProgressOption<TParams = { progress: number }> = {
  monitor?: (params: TParams) => void;
};
