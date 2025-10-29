import { inject } from '@angular/core';
import { SidenavStateFeature, withSidenavStore} from './sidenav';
import { signalStore } from '@ngrx/signals';

export type State = SidenavStateFeature;

export const Store = signalStore(
  { providedIn: 'root' },
  withSidenavStore()
);
