import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isNavbarCollapsed: boolean;
  isSignedIn: boolean;
  user: any;

  constructor(private authService: AuthService,
              private eventService: EventService,
              private flashMessages: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
    this.isNavbarCollapsed = true;
    if(this.authService.checkTokenExp()) {
      this.user = JSON.parse(this.authService.loadUser());
      this.isSignedIn = true;
    }
    else {
      this.isSignedIn = false;
    }

    this.eventService.signInEvent.subscribe((user) => {
      this.isSignedIn = true;
      this.user = user;
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
