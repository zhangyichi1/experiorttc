import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class EventService {

  @Output() signInEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  signInStateChange(user) {
    this.signInEvent.emit(user);
  }

}
