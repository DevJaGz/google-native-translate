import { inject, InjectionToken } from '@angular/core';
import { SidenavStore } from './sidenav';


export const Store = new InjectionToken('App Store', {
  providedIn: 'root',
  factory: () => ({
    sidenav: inject(SidenavStore),
  }),
});
