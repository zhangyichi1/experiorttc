import { Component, OnInit, HostBinding, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  isNavbarCollapsed: boolean;
  isSignedIn: boolean;
  user: User;

  constructor(private authService: AuthService,
              private eventService: EventService,
              private flashMessages: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
    this.isNavbarCollapsed = true;
    //if token is not expired get the user from localStorage
    // if(this.authService.checkTokenExp()) {
    //   this.user = JSON.parse(this.authService.loadUser());
    //   this.isSignedIn = true;
    // }
    // else {
    //   this.isSignedIn = false;
    // }

    this.user = this.authService.getCurrentUser();
    console.log("in header ngOnInit user is: ", this.user);
    this.isSignedIn = this.user == null ? false : true;

    this.eventService.signInEvent.subscribe((user) => {
      this.isSignedIn = true;
      this.user = user;
    })

    this.eventService.signInExpireEvent.subscribe(() => {
      this.isSignedIn = false;
      this.user = null;
    })
  }

  signOut() {
    this.authService.signOut();
    this.flashMessages.show('You have signed out and redirected to homepage', { cssClass: 'alert-success', timeout: 3000 });
    setTimeout(() => {
      this.isSignedIn = false;
      this.router.navigate(['/home']);
    }, 1000);
  }

  onBlur() {
    setTimeout(() => {
      this.isNavbarCollapsed = true;
      console.log('hahaha');
    }, 150);
  }
}
