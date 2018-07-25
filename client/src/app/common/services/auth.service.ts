import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';
import { EventService } from './event.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { FlashMessagesService } from 'angular2-flash-messages';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface response {
  success: boolean,
  token: string,
  user: {
    _id: string,
    email: string,
    username: string,
    address: string,
    phone: string,
    roles: string[]
  },
  message: string
}

@Injectable()
export class AuthService {

  authToken: any;
  user: User;
  // authState: any = null;

  constructor(private http: HttpClient,
              public afAuth: AngularFireAuth,
              private eventService: EventService,
              private flashMessages: FlashMessagesService) {
                if(this.checkTokenExp()) {
                  let userJson = JSON.parse(this.loadUser());
                  this.user = new User(userJson.email, userJson.username, userJson.address, userJson.phone, null, userJson.roles);
                  this.authToken = this.loadToken();
                }
                else {
                  this.user = null;
                  this.authToken = null;
                }
             }

  validateSignUp(user): boolean {
    console.log('user is: ', user);
    if(user.email == undefined || user.email == null || user.email == ''
    || user.username == undefined || user.username == null || user.username == ''
    || user.password == undefined || user.password == null || user.password == '') {
      return false;
    }else {
      return true;
    }
  }

  validateSignIn(user): boolean {
    if(user.email == undefined || user.email == '' || user.email == null
    || user.password == undefined || user.password == '' || user.password == null) {
      return false;
    }else {
      return true;
    }
  }

  validateEmail(email): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  signUpUser(user): Observable<any> {
    return this.http.post('http://localhost:3000/api/signup', user, httpOptions)
      .pipe(map((res) => {
        console.log('res is: ', res);
        return res;
      }));
  }

  signInUser(user): Observable<any> {
    return this.http.post('http://localhost:3000/api/signin', user, httpOptions)
      .pipe(map((res) => {
        console.log('res is: ', res);
        return res;
      }));
  }

  signOut(): Promise<any> {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    return this.afAuth.auth.signOut();
  }

  getUser(email): Observable<any> {
    this.appendToken();
    return this.http.get('http://localhost:3000/api/user/' + email, httpOptions)
      .pipe(map((res: any) => {
        return res;
      }), catchError((err) => {
        console.log('err is: ', err);
        return Observable.of(err);
      }));
  }

  getUsers(): Observable<any[]> {
    this.appendToken();
    return this.http.get('http://localhost:3000/api/users', httpOptions)
      .pipe(map((res: any[]) => {
        console.log('users are: ', res);
        return res;
      }), catchError((err) => {
        console.log('err is: ', err);
        return Observable.of(err);
      }));
  }

  updateUser(user: User): Observable<User> {
    console.log('user is: ', user);
    this.appendToken();
    console.log('httpOptions is: ', httpOptions);
    return this.http.put('http://localhost:3000/api/user', user, httpOptions)
      .pipe(map((res: any) => {
        console.log('res is: ', res);
        if(res.success) {
          this.user = new User(res.updatedUser.email, res.updatedUser.username, res.updatedUser.address, res.updatedUser.phone, res.updatedUser.roles);
          this.flashMessages.show(res.message, { cssClass: 'alert-success', timeout: 3000 });
          localStorage.setItem('user', JSON.stringify(this.user));
          this.eventService.signInStateChange(this.user);
          return this.user;
        }else {
          this.flashMessages.show(res.message, { cssClass: 'alert-danger', timeout: 3000 });
          return null;
        }
      }), catchError((err) => {
        console.log('err is: ', err);
        return Observable.of(err);
      }));
  }

  removeUser(email: string): Observable<User> {
    console.log('email is: ', email);
    this.appendToken();
    console.log('httpOptions is: ', httpOptions);
    return this.http.delete('http://localhost:3000/api/user/' + email, httpOptions)
      .pipe(map((res: any) => {
        console.log('res is: ', res);
        return res;
      }), catchError((err) => {
        console.log('err is: ', err);
        return Observable.of(err);
      }));
  }

  getCurrentUser(): User {
    return this.user;
  }

  storeUserData(token: string, user: User): void {
    this.authToken = token;
    this.user = user;
    localStorage.setItem('idToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  loadToken(): string {
    let token = localStorage.getItem('idToken');
    return token;
  }

  loadUser(): string {
    let user = localStorage.getItem('user');
    return user;
  }

  // check if token has expired, if yes return false
  checkTokenExp(): boolean {
    return tokenNotExpired('idToken');
  }

  signInWithGoogle(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((data) => {
      this.user = new User(data.user.email, data.user.displayName);
      this.authToken = data.credential.idToken;
      this.storeUserData(this.authToken, this.user);
      this.eventService.signInStateChange(this.user);
      console.log('user is: ', this.user);
      console.log('token is: ', this.authToken);
    });
  }

  appendToken() {
    if(this.isSignedIn()) {
      if(httpOptions.headers.has('Authorization')) {
        httpOptions.headers = httpOptions.headers.delete('Authorization');
        httpOptions.headers = httpOptions.headers.append('Authorization', this.authToken);
        console.log('httpOptions is: ', httpOptions);
      }else {
        httpOptions.headers = httpOptions.headers.append('Authorization', this.authToken);
        console.log('httpOptions is: ', httpOptions);
      }
    }else {
      if(httpOptions.headers.has('Authorization')) {
        httpOptions.headers = httpOptions.headers.delete('Authorization');
      }
    }
  }

  isSignedIn() {
    return this.user != null;
  }

}
