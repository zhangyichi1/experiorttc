import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.profileAccess().subscribe((profile) => {
      console.log('profile is: ', profile);
      this.user = profile.user;
    }, (err) => {
      console.log(err);
      return false;
    });
  }

}
