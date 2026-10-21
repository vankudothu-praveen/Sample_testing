import { Routes } from '@angular/router';
import { DashboardShellComponent } from './layout/dashboard-shell.component';

export const routes: Routes = [
  {
    path: '', component: DashboardShellComponent,
    children: [
      { path: 'loyalty-points', loadComponent: () => import('./features/loyalty-points/pages/loyalty-points-page.component').then((module) => module.LoyaltyPointsPageComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'loyalty-points' },
      { path: '**', redirectTo: 'loyalty-points' },
    ],
  },
];
