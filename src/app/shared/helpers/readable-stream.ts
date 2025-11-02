import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReadableStreamHelper {
  toObservable<T>(stream: ReadableStream<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
      const processStream = async () => {
        try {
          for await (const chunk of stream) {
            subscriber.next(chunk);
          }
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
          subscriber.complete();
        }
      };

      processStream();
    });
  }
}
