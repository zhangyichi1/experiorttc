import { Routes } from '@angular/router';

import { HomeComponent } from './common/home/home.component';
import { AuthenticationComponent } from './common/authentication/authentication.component';
import { SignupComponent } from './common/authentication/signup/signup.component';
import { SigninComponent } from './common/authentication//signin/signin.component';
import { AboutComponent } from './common/about/about.component';
import { ProfileComponent } from './common/profile/profile.component';

import { UserSignInGuard } from './common/guards/user-signin.guard';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'authentication', component: AuthenticationComponent, children: [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signin', component: SigninComponent },
    { path: 'signup', component: SignupComponent }
  ] },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [UserSignInGuard] },
  { path: '**', redirectTo: 'home', pathMatch: 'full'}
];
