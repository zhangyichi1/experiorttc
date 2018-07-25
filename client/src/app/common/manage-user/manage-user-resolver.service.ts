import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class ManageUserResolver implements Resolve<any> {

  constructor(private authService: AuthService,
              private flashMessages: FlashMessagesService) {}

  resolve() {
    return this.authService.getUsers()
      .pipe(map((res: any) => {
        if(res.status == 401) {
          this.flashMessages.show('You are not authorized to view this page!', { cssClass: 'alert-danger', timeout: 5000 });
          return res;
        }else {
          if(res.success) {
            let result = [];
            console.log('users are: ', res);
            res.users.forEach((ele) => {
              result.push(new User(ele.email, ele.username, ele.address, ele.phone, null, ele.roles));
            });
            console.log('result is: ', result);
            return result;
          }else {
            this.flashMessages.show(res.message, { cssClass: 'alert-danger', timeout: 5000 });
          }
        }
      }));
  }

}
