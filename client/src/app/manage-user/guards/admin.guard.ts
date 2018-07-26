import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { EventService } from '../../common/services/event.service';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private eventService: EventService) { }

  canActivate() {
    if(this.authService.checkTokenExp() && this.authService.getIsSignedIn() && this.authService.getIsAdmin()) {
      return true;
    }else {
      if(this.authService.getIsSignedIn()) {
        this.router.navigate(['/home']);
        return false;
      }else {
        this.eventService.signInExpired();
        this.router.navigate(['/home']);
        return false;
      }
    }
  }
}
