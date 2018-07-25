import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  signUpForm: FormGroup;

  constructor(private authService: AuthService,
              private eventService: EventService,
              private flashMessages: FlashMessagesService,
              private router: Router,
              private FormBuilder: FormBuilder) { }

  ngOnInit() {
    this.signUpForm = this.FormBuilder.group({
      'email': [null, [Validators.required, Validators.email]],
      'username': [null, [Validators.required, Validators.minLength(4)]],
      'password': [null, [Validators.required, Validators.minLength(4)]],
      'address': [''],
      'phone': ['']
    });
  }

  getEmailErrorMessage() {
    return this.signUpForm.get('email').hasError('required') ? 'Email is required' :
      this.signUpForm.get('email').hasError('email') ? 'Please enter a valid email' : '';
  }

  getUsernameErrorMessage() {
    return this.signUpForm.get('username').hasError('required') ? 'Username is required' :
      this.signUpForm.get('username').hasError('minlength') ? 'Username needs to be at least 4 characters' : '';
  }

  getPasswordErrorMessage() {
    return this.signUpForm.get('password').hasError('required') ? 'Password is required' :
      this.signUpForm.get('password').hasError('minlength') ? 'Password needs to be at least 4 characters' : '';
  }

  signUp() {
    console.log('signUpForm is: ', this.signUpForm);
    this.newUser = new User(this.signUpForm.value.email,
      this.signUpForm.value.username, this.signUpForm.value.address,
      this.signUpForm.value.phone, this.signUpForm.value.password);
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
