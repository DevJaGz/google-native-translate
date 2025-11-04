import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimingHelper {
  debounce(time = 300) {
    let id: ReturnType<typeof setTimeout>;
    return (callback: () => void) => {
      clearTimeout(id);
      id = setTimeout(() => {
        callback();
      }, time);
    };
  }
}
