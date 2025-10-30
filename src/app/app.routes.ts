import { Routes } from '@angular/router';
import { RoutePath } from '@shared/constants';


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
