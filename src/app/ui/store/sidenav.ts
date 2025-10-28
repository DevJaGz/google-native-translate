import { inject, InjectionToken } from '@angular/core';
import { signalStoreFeature, withState } from '@ngrx/signals';

export type SidenavState = {
  isOpen: boolean;
};

export const initialSidenavState: SidenavState = {
  isOpen: false,
};

export const INITIAL_SIDENAV_STATE = new InjectionToken<SidenavState>('Initial Sidenav State', {
  providedIn: 'root',
  factory: () => initialSidenavState,
});


export function withSidenavState() {
  return signalStoreFeature(
    withState<SidenavState>(() => inject(INITIAL_SIDENAV_STATE))
  )
}
