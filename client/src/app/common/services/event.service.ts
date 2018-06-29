import { Injectable, Output, EventEmitter } from '@angular/core';
import { User } from '../models/user.model';

@Injectable()
export class EventService {

  @Output() signInEvent: EventEmitter<User> = new EventEmitter();
  @Output() signInExpireEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  signInStateChange(user) {
    this.signInEvent.emit(user);
  }

  signInExpired() {
    this.signInExpireEvent.emit();
  }

}
