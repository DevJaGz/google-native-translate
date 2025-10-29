import { Routes } from '@angular/router';

export const RoutePath = {
  TEXT_TRANSLATION: 'text',
} as const;

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutePath.TEXT_TRANSLATION,
  },
  {
    path: RoutePath.TEXT_TRANSLATION,
    loadComponent: () => import('@ui/views').then((m) => m.TextTranslation),
  },
];
