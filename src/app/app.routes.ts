import { Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import {AppGuard} from './app.guard';
import {LoaderAppComponent} from './pages/loader/loader.component';

export const ROUTES: Routes = [{
   path: '', redirectTo: 'microfunctions', pathMatch: 'full'
  },
  {
    path: 'microfunctions', canActivate: [AppGuard],   loadChildren: './layout/layout.module#LayoutModule'
  },
  {
    path: 'login', loadChildren: './pages/login/login.module#LoginModule'
  },
  {
    path: 'register', loadChildren: './pages/register/register.module#RegisterModule'
  },
  {
    path: 'error', component: ErrorComponent
  },
  {
    path: 'loader', component: LoaderAppComponent
  },
  {
    path: '**',    component: ErrorComponent
  }
];
