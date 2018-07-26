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
  // isSignedIn: boolean = false;
  // isAdmin: boolean = false;
  // user: User;

  constructor(public authService: AuthService,
              private eventService: EventService,
              private flashMessages: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
    this.isNavbarCollapsed = true;

    // this.user = this.authService.getCurrentUser();
    // console.log("in header ngOnInit user is: ", this.user);
    // this.isSignedIn = this.user == null ? false : true;
    // if(this.isSignedIn) {
    //   this.isAdmin = this.user.roles.indexOf('admin') == -1 ? false : true;
    // }else {
    //   this.isAdmin = false;
    // }
    //
    // this.eventService.signInEvent.subscribe((user) => {
    //   this.isSignedIn = true;
    //   this.user = user;
    //   this.isAdmin = this.user.roles.indexOf('admin') == -1 ? false : true;
    // })
    //
    // this.eventService.signInExpireEvent.subscribe(() => {
    //   this.isSignedIn = false;
    //   this.user = null;
    //   this.isAdmin = false;
    // })
  }

  signOut() {
    this.authService.signOut();
    this.flashMessages.show('You have signed out and redirected to homepage', { cssClass: 'alert-success', timeout: 3000 });
      // this.isSignedIn = false;
      // this.isAdmin = false;
    this.router.navigate(['/home']);
  }
}
