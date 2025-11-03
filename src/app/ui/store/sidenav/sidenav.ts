import { inject, InjectionToken } from '@angular/core';
import { patchState, signalStore, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export type SidenavState = {
  isOpen: boolean;
};

export const initialSidenavState: SidenavState = {
  isOpen: false,
};

export const INITIAL_SIDENAV_STATE = new InjectionToken<SidenavState>(
  'Initial Sidenav State',
  {
    providedIn: 'root',
    factory: () => initialSidenavState,
  }
);

export const SidenavStore = signalStore(
  { providedIn: 'root' },
  withState<SidenavState>(() => inject(INITIAL_SIDENAV_STATE)),
  withMethods((store) => ({
    toggle() {
      patchState(store, {
        isOpen: !store.isOpen(),
      });
    },
    setIsOpen(isOpen: boolean) {
      patchState(store, {
        isOpen,
      });
    },
  }))
);
