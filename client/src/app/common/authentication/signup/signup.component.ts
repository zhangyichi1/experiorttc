import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private authService: AuthService,
              private eventService: EventService,
              private flashMessages: FlashMessagesService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    let email = '';
    let username = '';
    let password = '';

    this.signUpForm = new FormGroup({
      email: new FormControl(email),
      username: new FormControl(username),
      password: new FormControl(password)
    })

    // console.log(this.signUpForm);
  }

  onSubmit() {
    const user = {
      email: this.signUpForm.value.email,
      username: this.signUpForm.value.username,
      password: this.signUpForm.value.password
    }
    // console.log(user);
    if(!this.authService.validateSignUp(user)) {
      this.flashMessages.show('All the fields are required', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }else if(!this.authService.validateEmail(user.email)) {
      this.flashMessages.show('Email entered is invalid', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }else {
      // console.log(this.authService.registerUser(user));
      this.authService.signUpUser(user).subscribe((data) => {
        // console.log('data is: ', data);
        if(data.success) {
          this.authService.storeUserData(data.token, data.user);
          this.flashMessages.show('User registered, redirecting to homepage...', { cssClass: 'alert-success', timeout: 3000 });
          setTimeout(() => {
            this.eventService.signInStateChange(data.user);
            this.router.navigate(['/home']);
          }, 1000);
        }else {
          this.flashMessages.show('Registration failed', { cssClass: 'alert-danger', timeout: 3000 });
          setTimeout(() => {
            this.router.navigate(['/authentication/signup']);
          }, 1000);
        }
      });
    }
  }

}
