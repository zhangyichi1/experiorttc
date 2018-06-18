import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class EventService {

  @Output() signInEvent: EventEmitter<any> = new EventEmitter();
  @Output() signInExpireEvent: EventEmitter<any> = new EventEmitter();
  // @Output() addCalendarEvent: EventEmitter<any> = new EventEmitter();

  // @Output() testEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  signInStateChange(user) {
    this.signInEvent.emit(user);
  }

  signInExpired() {
    this.signInExpireEvent.emit();
  }

  // addCalendarEvents(newSchedule) {
  //   console.log('in calendarEvent');
  //   this.addCalendarEvent.emit(newSchedule);
  // }

  // testingEvent() {
  //   console.log('in testing event method');
  //   this.testEvent.emit('im the test event');
  // }

}
