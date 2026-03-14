import { Routes } from '@angular/router';
import { AdminLayout } from './layouts/admin/admin-layout-component/admin-layout-component';
import { ComponentPage } from './core/component-page/component-page';
import { MainLayoutComponent } from './layouts/main/main-layout-component/main-layout-component';

export const routes: Routes = [
  {
    path: '',
    component: ComponentPage,
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register-page/register-page').then((m) => m.RegisterPage),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  {
    path: 'hotel',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home-page/home-page').then((m) => m.HomePage),
      },
      {
        path: 'payment',
        loadComponent: () =>
          import('./features/payment-page/payment-page').then((m) => m.PaymentPage),
      },
      {
        path: 'roombooking',
        loadComponent: () =>
          import('./features/roombooking/roombooking-page').then((m) => m.RoombookingPage),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },

  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'manage-room',
        loadComponent: () =>
          import('./features/admin/manage-room/manage-room').then((m) => m.ManageRoom),
      },
      { path: '', redirectTo: 'manage-room', pathMatch: 'full' },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
