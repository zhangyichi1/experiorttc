import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class UserSignInGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private eventService: EventService) { }

  canActivate() {
    if(this.authService.checkTokenExp()) {
      return true;
    }else {
      // this.flashMessages.show('Your session has expired, please log in again.', { cssClass: 'alert-danger', timeout: 3000 });
      this.eventService.signInExpired();
      this.router.navigate(['/home']);
      return false;
    }
  }
}
