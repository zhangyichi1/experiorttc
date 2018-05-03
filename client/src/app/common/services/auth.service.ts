import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';
import { EventService } from './event.service';


@Injectable()
export class AuthService {

  authToken: any;
  user: any;
  // authState: any = null;

  constructor(private http: Http,
              public afAuth: AngularFireAuth,
              private eventService: EventService) {
              // this.afAuth.authState.subscribe((auth) => {
                // this.authState = auth;

                // console.log('in constructor auth token is: ', auth.getIdToken());
                // console.log('in constructor email is: ', auth.email);
                // console.log('in constructor username is: ', auth.displayName);
                // this.storeUserData(data.token, data.user);
                // this.flashMessages.show('Sign in successfully, redirecting to homepage...', { cssClass: 'alert-success', timeout: 3000 });
                // setTimeout(() => {
                //   this.eventService.signInStateChange(data.user);
                //   this.router.navigate(['/home']);
                // }, 1000);
              // })
             }

  validateSignUp(user) {
    if(user.email == undefined || user.email == ''
    || user.username == undefined || user.username == ''
    || user.password == undefined || user.password == '') {
      return false;
    }else {
      return true;
    }
  }

  validateSignIn(user) {
    if(user.email == undefined || user.email == '' || user.email == null
    || user.password == undefined || user.password == '' || user.password == null) {
      return false;
    }else {
      return true;
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  signUpUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/signup', user, { headers: headers })
      .pipe(map((res) => {
        // console.log('res is: ', res.json());
        return res.json();
      }));
  }

  signInUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/signin', user, { headers: headers })
      .pipe(map((res) => {
        return res.json();
      }))
  }

  signOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    return this.afAuth.auth.signOut();
  }

  profileAccess() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/api/profile', { headers: headers })
      .pipe(map((res) => {
        return res.json();
      }))
  }

  storeUserData(token, user) {
    this.authToken = token;
    this.user = user;
    localStorage.setItem('idToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  loadToken() {
    const token = localStorage.getItem('idToken');
    return this.authToken = token;
  }

  loadUser() {
    const user = localStorage.getItem('user');
    return this.user = user;
  }

  checkTokenExp() {
    return tokenNotExpired('idToken');
  }

  signInWithGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((data) => {
      // console.log('in signin data is: ', data.user.displayName);
      // console.log('in signin credential is: ', data.credential.idToken);
      this.user = {
        email: data.user.email,
        username: data.user.displayName
      };
      this.authToken = data.credential.idToken;
      this.storeUserData(this.authToken, this.user);
      this.eventService.signInStateChange(this.user);
      console.log('user is: ', this.user);
      console.log('token is: ', this.authToken);
    });
  }

}
