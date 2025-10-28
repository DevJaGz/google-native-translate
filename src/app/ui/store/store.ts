import { inject, InjectionToken } from '@angular/core';
import { initialSidenavState, SidenavState, withSidenavState } from './sidenav';
import { signalStore, withState } from '@ngrx/signals';

export type State = {
  sidenav: SidenavState;
};

export const initialState: State = {
  sidenav: initialSidenavState,
};

export const INITIAL_STATE = new InjectionToken<State>('Initial App State', {
  providedIn: 'root',
  factory: () => initialState,
});

export const Store = signalStore(
  { providedIn: 'root' },
  withState<State>(() => inject(INITIAL_STATE)),
  withSidenavState()
);
