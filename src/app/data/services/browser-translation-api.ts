import { AppError } from '@core/models';
import {
  finalize,
  first,
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

export type ApiSession = {
  destroy(): void;
};

export type BaseApiRequest = {
  options?: {
    monitor?: (progress: ProgressEvent) => void;
    abortSignal?: AbortSignal;
  };
};

/**
 * This class is a base class for all Translation APIs.
 * It provides a common logic to work with APIs in the browser.
 *
 * @param TApiSession - Type of the API session (instance of the API).
 * @param TRequest - Type of the parameters required by the API.
 */
export abstract class BrowserTranslationApi<
  TApiSession extends ApiSession,
  TRequest extends BaseApiRequest,
> {
  /**
   * In this method must include the logic to check if the API
   * is supported in the current browser.
   *
   * @param request - Parameters required by the API.
   */
  protected abstract hasBrowserSupport(
    request?: Partial<TRequest>,
  ): Observable<boolean>;

  /**
   * In this method must include the logic to check if the API
   * is available to be used in the current browser.
   *
   * @param request  - Parameters required by the API.
   */
  protected abstract isAvailable(
    request?: Partial<TRequest>,
  ): Observable<boolean>;

  /**
   * In this method must include the logic to create the API session.
   *
   * @param request - Parameters required by the API.
   */
  protected abstract createSession(
    request: TRequest,
    monitor?: (event: EventTarget) => void,
  ): Observable<TApiSession>;

  /**
   * In this method must include the logic to check if the API session
   * is valid to be used with the current parameters.
   *
   * @param request - Parameters required by the API.
   */
  protected abstract isSessionValid(request: TRequest): boolean;

  /**
   * In this method must include the logic to check if the API operation
   * is supported in the current browser.
   *
   * @param request - Parameters required by the API.
   */
  protected abstract isOperationSupported(
    request?: Partial<TRequest>,
  ): Observable<boolean>;
  protected abstract operationNotSupportedError(): AppError;

  /**
   *  Session created.
   */
  private session?: TApiSession;

  /**
   * Progress event listener stored when the
   * session was created and monitored. It is used
   * to destroy the event listener when the session
   * is destroyed.
   */
  private monitorEvent?: EventTarget;

  /**
   * Progress event listener stored when the
   * session was created and monitored. It is used
   * to destroy the event listener when the session
   * is destroyed.
   */
  private progressListener?: EventListener;

  /**
   * Get the current stored session, if it is available and
   * can be used with the current parameters, otherwise create
   * a new session. In case a new session must be created and:
   * - It can not operate in the current browser, throw an error.
   * - A model need to be downloaded, monitor the download progress.
   *
   * @param request - Parameters required by the API.
   * @returns Session created.
   */
  protected getSession(request: TRequest): Observable<TApiSession> {
    if (this.session && this.isSessionValid(request)) {
      return of(this.session);
    }

    this.destroySession();

    return this.isOperationSupported(request).pipe(
      switchMap((isOperationSupported) =>
        isOperationSupported
          ? this.isAvailable(request)
          : throwError(() => this.operationNotSupportedError()),
      ),
      switchMap((isAvailable) =>
        isAvailable
          ? this.createSession(request)
          : this.createAndMonitorSession(request),
      ),
      tap((session) => {
        this.session = session;
      }),
    );
  }


  /**
   * Create and monitor a new API session.
   * 
   * @param request - Parameters required by the API.
   * @returns - Session created.
   */
  private createAndMonitorSession(request: TRequest): Observable<TApiSession> {
    const progress$ = new Subject<ProgressEvent>();

    const monitor = (event: EventTarget) => {
      this.monitorEvent = event;
      this.progressListener = (result: Event) => {
        progress$.next(result as ProgressEvent);
      };
      this.monitorEvent.addEventListener(
        'downloadprogress',
        this.progressListener,
      );
    };

    const session$ = this.createSession(request, monitor);

    const ready$ = progress$.pipe(
      tap((progress) => {
        const monitorFn = request.options?.monitor;
        if (monitorFn) {
          monitorFn(progress);
        }
      }),
      first((progress) => progress.loaded === progress.total),
    );

    return forkJoin([session$, ready$]).pipe(
      map(([session]) => session),
      finalize(() => progress$.complete()),
    );
  }

  private destroySession() {
    this.session?.destroy();
    this.session = undefined;
    this.destroyProgressEvent();
  }

  private destroyProgressEvent() {
    this.monitorEvent?.removeEventListener(
      'downloadprogress',
      this.progressListener!,
    );
    this.monitorEvent = undefined;
  }
}
