export type API = Translator | LanguageDetector;

export class BrowserTranslationApi<TApi extends API> {
  protected session?: TApi;
  protected monitorEvent?: EventTarget;
  protected progressListener?: EventListener;

  destroy() {
    this.session?.destroy();
    this.session = undefined;
    this.distroyProgressEvent();
  }

  protected distroyProgressEvent() {
    this.monitorEvent?.removeEventListener(
      'downloadprogress',
      this.progressListener!,
    );
    this.monitorEvent = undefined;
  }
}
