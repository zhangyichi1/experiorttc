import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { map } from 'rxjs/operators';
import { YearSchedule, MonthSchedule, DaySchedule, CalendarEvent } from './schedule.model';

import { CalendarService } from '../services/calendar.service';

@Injectable()
export class CalendarResolver implements Resolve<any> {

  constructor(public calendarService: CalendarService) {}

  resolve() {
    if(this.calendarService.checkYearSchedules()) {
      return null;
    }else {
      return this.calendarService.getYearSchedules(new Date().getFullYear())
        .pipe(map((res: any) => {
          console.log('in resolver before res is: ', res);
          for(let i=0; i<2; i++) {
            for(let k=0; k<res.yearSchedules.yearSchedules[i].monthSchedules.length; k++) {
              for(let l=0; l<res.yearSchedules.yearSchedules[i].monthSchedules[k].daySchedules.length; l++) {
                for(let m=0; m<res.yearSchedules.yearSchedules[i].monthSchedules[k].daySchedules[l].events.length; m++) {
                  let event = res.yearSchedules.yearSchedules[i].monthSchedules[k].daySchedules[l].events[m];
                  res.yearSchedules.yearSchedules[i].monthSchedules[k].daySchedules[l].events[m] =
                    new CalendarEvent(event.title, new Date(event.startingTime), new Date(event.endingTime), event.description, event.color);
                }
                let daySchedule = res.yearSchedules.yearSchedules[i].monthSchedules[k].daySchedules[l];
                res.yearSchedules.yearSchedules[i].monthSchedules[k].daySchedules[l] =
                  new DaySchedule(daySchedule.day, daySchedule.dayOfWeek, daySchedule.month, daySchedule.year, daySchedule.events);
              }
              let monthSchedule = res.yearSchedules.yearSchedules[i].monthSchedules[k];
              res.yearSchedules.yearSchedules[i].monthSchedules[k] =
                new MonthSchedule(monthSchedule.month, monthSchedule.daySchedules);
            }
            let yearSchedule = res.yearSchedules.yearSchedules[i];
            res.yearSchedules.yearSchedules[i] = new YearSchedule(yearSchedule.year, yearSchedule.monthSchedules);
          }

          console.log('in resolver after res is: ', res);
          return res;
        }));
    }
  }
}
