import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutesModule } from './app-routes.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CdkTableModule } from '@angular/cdk/table';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatTableModule,
  MatSliderModule,
  MatPaginatorModule,
  MatSortModule
} from '@angular/material';
import { Angular5TimePickerModule } from 'angular5-time-picker';

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
import { CalendarComponent } from './common/calendar/calendar.component';
import { EventModalComponent } from './common/calendar/event-modal/event-modal.component';
import { EventModalDialogComponent } from './common/calendar/event-modal/event-modal.component';
import { EventEditModalDialogComponent } from './common/calendar/calendar.component';

import { firebaseConfig } from './config/config';

import { AuthService } from './common/services/auth.service';
import { EventService } from './common/services/event.service';
import { CalendarService } from './common/services/calendar.service';

import { UserSignInGuard } from './common/guards/user-signin.guard';
import { CalendarResolver } from './common/calendar/calendar-resolver.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    HeaderComponent,
    ProfileComponent,
    AuthenticationComponent,
    SignupComponent,
    SigninComponent,
    CalendarComponent,
    EventModalComponent,
    EventModalDialogComponent,
    EventEditModalDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    FlashMessagesModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    Angular5TimePickerModule,
    FlexLayoutModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSliderModule,
    MatPaginatorModule,
    MatSortModule
  ],
  entryComponents: [EventModalDialogComponent, EventEditModalDialogComponent],
  providers: [AuthService, EventService, CalendarService, UserSignInGuard, CalendarResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
