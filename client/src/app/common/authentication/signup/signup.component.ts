import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  newUser: User;

  constructor(private authService: AuthService,
              private eventService: EventService,
              private flashMessages: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
  }

  signUp(form: NgForm) {
    console.log('f value is: ', form.value);
    this.newUser = new User(form.value.email, form.value.username, form.value.address, form.value.phone, form.value.password);
    console.log('newUser is: ', this.newUser);
    if(!this.authService.validateSignUp(this.newUser)) {
      this.flashMessages.show('All the fields are required', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }else if(!this.authService.validateEmail(this.newUser.getEmail())) {
      this.flashMessages.show('Email entered is invalid', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }else {
      this.authService.signUpUser(this.newUser).subscribe((data) => {
        if(data.success) {
          let user = new User(data.user.email, data.user.username, data.user.address, data.user.phone, null, data.user.roles);
          this.authService.storeUserData(data.token, user);
          this.flashMessages.show('User registered, redirecting to homepage...', { cssClass: 'alert-success', timeout: 3000 });
          setTimeout(() => {
            this.eventService.signInStateChange(user);
            this.router.navigate(['/home']);
          }, 1000);
        }else {
          this.flashMessages.show(data.message, { cssClass: 'alert-danger', timeout: 3000 });
          setTimeout(() => {
            this.router.navigate(['/authentication/signin']);
          }, 1000);
        }
      });
    }
  }

}
