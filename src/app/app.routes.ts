import { Routes } from '@angular/router';
import { UserList } from './users/user-list/user-list';
import { DashboardLayout } from './dashboard/dashboard';
import { DataComponent } from './dashboard/data/data';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.Login)
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup').then(m => m.Register)
  },

  {
    path: 'dashboard',

    //  GUARD
    canActivate: [authGuard],

    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.DashboardLayout),

    children: [
      {
        path: '',
        redirectTo: 'user-profile',
        pathMatch: 'full'
      },
      { path: 'user-profile', 
        loadComponent: () => 
          import('./dashboard/user-profile/user-profile').then(m => m.UserProfile) },

      {
        path: 'users',
        loadComponent: () =>
          import('./users/user-list/user-list').then(m => m.UserList),
      },

      //  ADD THIS
      {
        path: 'data',
        loadComponent: () =>
          import('./dashboard/data/data').then(m => m.DataComponent)
      }
    ]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];