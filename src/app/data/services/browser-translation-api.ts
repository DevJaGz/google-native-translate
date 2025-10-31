export type API = Translator | LanguageDetector;

export class BrowserTranslationApi<TApi extends API> {
  protected session?: TApi;
  protected monitorEvent?: EventTarget;
  protected progressListener?: EventListener;

  protected destroySession() {
    this.session?.destroy();
    this.session = undefined;
    this.destroyProgressEvent();
  }

  protected destroyProgressEvent() {
    this.monitorEvent?.removeEventListener(
      'downloadprogress',
      this.progressListener!,
    );
    this.monitorEvent = undefined;
  }
}
