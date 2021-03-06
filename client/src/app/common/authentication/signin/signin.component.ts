import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

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
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.email]],
      'password': [null, Validators.required]
    })
  }

  getEmailErrorMessage() {
    return this.signInForm.get('email').hasError('required') ? 'Email is required' :
      this.signInForm.get('email').hasError('email') ? 'Please enter a valid email' : '';
  }

  signIn() {
    const user = {
      'email': this.signInForm.value.email,
      'password': this.signInForm.value.password
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
          let user = new User(data.user.email, data.user.username, data.user.address, data.user.phone, null, data.user.roles);
          this.authService.storeUserData(data.token, user);
          this.flashMessages.show('Sign in successfully, redirecting to homepage...', { cssClass: 'alert-success', timeout: 3000 });
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
      })
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then(() => {
      this.router.navigate(['/home']);
    });
  }

}
