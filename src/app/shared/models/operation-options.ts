export type AbortOperationOption = {
  abortSignal?: AbortSignal;
};

export type SupportedLanguagesOption = { supportedLanguageCodes?: string[] };

export type MonitorOption<TParams = undefined> = {
  monitor?: (params: TParams) => void;
};
