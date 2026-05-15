import { Routes } from '@angular/router';
import { UserList } from './users/user-list/user-list';
import { DashboardLayout } from './dashboard/dashboard';

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
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.DashboardLayout),

    children: [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
   loadComponent:()=>
    import('./users/user-list/user-list').then(m=>m.UserList),
  }
]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];