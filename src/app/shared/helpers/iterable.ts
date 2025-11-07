import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IterableHelper {
  toObservable<T>(iterable: AsyncIterable<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
      let cancelled = false;

      const processStream = async () => {
        try {
          for await (const chunk of iterable) {
            if (cancelled) break;
            subscriber.next(chunk);
          }
          if (cancelled) return;
          subscriber.complete();
        } catch (error) {
          if (cancelled) return;
          subscriber.error(error);
        }
      };

      processStream();

      return () => {
        cancelled = true;
      };
    });
  }
}
