import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  editMode: boolean;

  initEmail: string;
  initUsername: string;
  initAddress: string;
  initPhone: string;
  currEmail: string;
  currUsername: string;
  currAddress: string;
  currPhone: string;

  constructor(private authService: AuthService,
              private router: Router,
              private flashMessages: FlashMessagesService) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    console.log('in profile constructor user is: ', this.user);
    this.editMode = false;

    this.initEmail = this.user.email;
    this.initUsername = this.user.username;
    this.initAddress = this.user.address;
    this.initPhone = this.user.phone;

    this.currEmail = this.initEmail;
    this.currUsername = this.initUsername;
    this.currAddress = this.initAddress;
    this.currPhone = this.initPhone;
  }

  edit() {
    if(this.editMode) {
      this.currEmail = this.initEmail;
      this.currUsername = this.initUsername;
      this.currAddress = this.initAddress;
      this.currPhone = this.initPhone;
    }else {
      this.flashMessages.show('The fields are editable now!', { cssClass: 'alert-success', timeout: 5000 });
    }
    this.editMode = !this.editMode;
  }

  save(form: NgForm) {
    console.log('values are: ', form.value);
    ;
    let updatedUser = new User(form.value.currEmail, form.value.currUsername, form.value.currAddress, form.value.currPhone);
    console.log('updatedUser is: ', updatedUser);

    this.authService.updateUser(updatedUser).subscribe((res: User) => {
      if(res) {
        console.log('res is: ', res);
        this.editMode = !this.editMode;
      }else {
        this.currEmail = this.initEmail;
        this.currUsername = this.initUsername;
        this.currAddress = this.initAddress;
        this.currPhone = this.initPhone;
      }
    })


  }

}
