import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { AboutComponent } from './common/about/about.component';
import { HomeComponent } from './common/home/home.component';
import { HeaderComponent } from './common/header/header.component';
import { ProfileComponent } from './common/profile/profile.component';
import { AuthenticationComponent } from './common/authentication/authentication.component';
import { SignupComponent } from './common/authentication/signup/signup.component';
import { SigninComponent } from './common/authentication/signin/signin.component';

import { AuthService } from './common/services/auth.service';
import { EventService } from './common/services/event.service';

import { UserSignInGuard } from './common/guards/user-signin.guard';

export const firebaseConfig = {
  apiKey: "AIzaSyA4s7fD7eN4V5J4Ym3fXN-QNHKc0WmXw_0",
  authDomain: "experiorttc-7b04d.firebaseapp.com",
  databaseURL: "https://experiorttc-7b04d.firebaseio.com",
  projectId: "experiorttc-7b04d",
  storageBucket: "experiorttc-7b04d.appspot.com",
  messagingSenderId: "493874735216"
}

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    HeaderComponent,
    ProfileComponent,
    AuthenticationComponent,
    SignupComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(rootRouterConfig),
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    FlashMessagesModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [AuthService, EventService, UserSignInGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
