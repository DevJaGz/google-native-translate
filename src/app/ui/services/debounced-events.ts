import {
    makeEnvironmentProviders
} from '@angular/core';
import {
    EVENT_MANAGER_PLUGINS,
    EventManagerPlugin,
} from '@angular/platform-browser';
import { debounceTime, fromEvent } from 'rxjs';

export class DebouncedEventsManager extends EventManagerPlugin {
  override supports(eventName: string): boolean {
    return /debounce/.test(eventName);
  }
  
  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function,
  ): Function {
    const [originalEventName, _, delay] = eventName.split('.'); // Example: ['input', 'debounce', '300']
    const sub = fromEvent(element, originalEventName)
      .pipe(debounceTime(this.calculateDuration(delay)))
      .subscribe((event) => handler(event));
    return () => sub.unsubscribe();
  }

  protected calculateDuration(duration: string) {
    const matchGroup = duration.match(/(?<time>\d+)(?<unit>ms|s|)/)?.groups;
    if (!matchGroup) {
      throw new Error(`Provided wrong time format...`);
    }
    const { unit, time } = matchGroup;
    switch (unit) {
      case '':
      case 'ms':
        return Number(time);
      case 's':
        return Number(time) * 1000;
      default:
        throw new Error(`Wrong unit provided: ${unit}`);
    }
  }
}

export const provideDebouncedEvents = () =>
  makeEnvironmentProviders([
    {
      provide: EVENT_MANAGER_PLUGINS,
      multi: true,
      useClass: DebouncedEventsManager,
    },
  ]);
