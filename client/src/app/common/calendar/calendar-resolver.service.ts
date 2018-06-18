import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { CalendarService } from '../services/calendar.service';

@Injectable()
export class CalendarResolver implements Resolve<any> {

  constructor(public calendarService: CalendarService) {}

  resolve() {
    if(this.calendarService.checkYearSchedules()) {
      return null;
    }else {
      return this.calendarService.getYearSchedules(new Date().getFullYear());
    }
  }
}
