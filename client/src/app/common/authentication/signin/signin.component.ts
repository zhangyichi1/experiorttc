import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signInForm: FormGroup;

  constructor(private authService: AuthService,
              private eventService: EventService,
              private flashMessages: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    let email = '';
    let password = '';

    this.signInForm = new FormGroup({
      'email': new FormControl(email),
      'password': new FormControl(password)
    });
  }

  onSubmit() {
    const user = {
      email: this.signInForm.value.email,
      password: this.signInForm.value.password
    }

    if(!this.authService.validateSignIn(user)) {
      this.flashMessages.show('All the fields are required', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }else if(!this.authService.validateEmail(user.email)) {
      this.flashMessages.show('Email entered is invalid', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }else {
      this.authService.signInUser(user).subscribe((data) => {
        // console.log('data is: ', data);
        if(data.success) {
          this.authService.storeUserData(data.token, data.user);
          this.flashMessages.show('Sign in successfully, redirecting to homepage...', { cssClass: 'alert-success', timeout: 3000 });
          setTimeout(() => {
            this.eventService.signInStateChange(data.user);
            this.router.navigate(['/home']);
          }, 1000);
        }else {
          this.flashMessages.show(data.message, { cssClass: 'alert-danger', timeout: 3000 });
          setTimeout(() => {
            this.router.navigate(['/authentication/signin']);
          }, 1000);
        }
      })
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then(() => {
      this.router.navigate(['/home']);
    });
  }

}