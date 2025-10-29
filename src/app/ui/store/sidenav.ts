import { inject, InjectionToken } from '@angular/core';
import { signalStoreFeature, withState } from '@ngrx/signals';

export type  SidenavState = {
  isOpen: boolean;
}

export type SidenavStateFeature = {
  sidenav: SidenavState;
};

export const initialSidenavStateFeature: SidenavStateFeature = {
  sidenav: {
    isOpen: false,
  },
};

export const INITIAL_SIDENAV_STATE_FEATURE = new InjectionToken<SidenavStateFeature>('Initial Sidenav State Feature', {
  providedIn: 'root',
  factory: () => initialSidenavStateFeature,
});


export function withSidenavStore() {
  return signalStoreFeature(
    withState<SidenavStateFeature>(() => inject(INITIAL_SIDENAV_STATE_FEATURE))
  )
}
