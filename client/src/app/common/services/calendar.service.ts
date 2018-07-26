import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';
import { DaySchedule, MonthSchedule, YearSchedule, CalendarEvent } from '../models/schedule.model';
import { EventService } from './event.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


const monthes = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface UpdatedDaySchedule {
  status: number,
  success: boolean,
  message: string,
  updatedDaySchedule: DaySchedule
}
@Injectable()
export class CalendarService {

  yearSchedules: any[];
  date: Date;

  currentYearSchedule: any;
  nextYearSchedule: any;

  constructor(private http: HttpClient,
              private eventService: EventService,
              private authService: AuthService) {

    this.yearSchedules = [];
    this.date = new Date();
    // this.generateYearSchedules();
    // this.yearSchedules = [this.currentYearSchedule, this.nextYearSchedule];
  }

  // addClendar(yearSchedule): any {
  //   // console.log('in calendar service: ', yearSchedule);
  //   return this.http.post<any>('http://localhost:3000/api/calendar', yearSchedule, httpOptions)
  //     .pipe(map((res) => {
  //       console.log('in addClendar res is: ', res);
  //       return res;
  //     }));
  // }

  getYearSchedules(currentYear) {
    return this.http.get('http://localhost:3000/api/calendar/' + currentYear);
  }

  getCurrentYearSchedule() {
    return this.currentYearSchedule;
  }

  getNextYearSchedule() {
    return this.nextYearSchedule;
  }

  setCurrentYearSchedule(yearSchedule) {
    this.currentYearSchedule = yearSchedule;
  }

  setNextYearSchedule(yearSchedule) {
    this.nextYearSchedule = yearSchedule;
  }

  checkYearSchedules() {
    return (this.currentYearSchedule != undefined && this.currentYearSchedule != null &&
            this.nextYearSchedule != undefined && this.nextYearSchedule != null);
  }

  addEvent(event, year, month, day): Observable<UpdatedDaySchedule> {
    console.log('event is: ', event);
    this.appendToken();
    return this.http.post<UpdatedDaySchedule>('http://localhost:3000/api/event',
      {
        year: year,
        day: day,
        newEvent: event,
        month: month
      }, httpOptions)
      .pipe(map((res: UpdatedDaySchedule) => {
        console.log('in addEvent res is: ', res);
        if(res.success) {
          if(year == this.currentYearSchedule.year) {
            this.currentYearSchedule.monthSchedules[month].daySchedules[day] = res.updatedDaySchedule;
          }else {
            this.nextYearSchedule.monthSchedules[month].daySchedules[day] = res.updatedDaySchedule;
          }
        }
        return res;
      }), catchError((err) => {
        console.log('err is: ', err);
        return Observable.of(err);
      }));
  }

  deleteEvent(year, month, day, eventIndex): Observable<UpdatedDaySchedule> {
    // console.log("url is: ", 'http://localhost:3000/api/event/' + year + '/' + month + '/' + day + '/' + eventIndex);
    this.appendToken();
    console.log('httpOptions is: ', httpOptions);
    return this.http.delete<UpdatedDaySchedule>('http://localhost:3000/api/event/' + year + '/' + month + '/' + day + '/' + eventIndex, httpOptions)
    .pipe(tap((res: UpdatedDaySchedule) => {
      console.log('in deleteEvent res is: ', res);
      if(res.success) {
        if(year == this.currentYearSchedule.year) {
          this.currentYearSchedule.monthSchedules[month].daySchedules[day].events.splice(eventIndex, 1);
        }else {
          this.nextYearSchedule.monthSchedules[month].daySchedules[day].events.splice(eventIndex, 1);
        }
      }
      return res;
    }), catchError((err) => {
      console.log('err is: ', err);
      return Observable.of(err);
    }));
  }

  appendToken() {
    if(this.authService.getIsSignedIn()) {
      if(httpOptions.headers.has('Authorization')) {
        httpOptions.headers = httpOptions.headers.delete('Authorization');
        httpOptions.headers = httpOptions.headers.append('Authorization', this.authService.loadToken());
        console.log('httpOptions is: ', httpOptions);
      }else {
        httpOptions.headers = httpOptions.headers.append('Authorization', this.authService.loadToken());
        console.log('httpOptions is: ', httpOptions);
      }
    }else {
      if(httpOptions.headers.has('Authorization')) {
        httpOptions.headers = httpOptions.headers.delete('Authorization');
      }
    }
  }


  //the commentted code is used for generating original schedule object

  // getRandomEventNum(seed: number) {
  //   return Math.floor(Math.random() * seed);
  // }
  //
  // getRandomParticipantNum(seed: number) {
  //   return Math.floor(Math.random() * seed + 1);
  // }
  //
  // generateYearSchedules() {
  //   const year = this.date.getFullYear();
  //   let monthSchedules: MonthSchedule[] = [];
  //   let secondMonthSchedules: MonthSchedule[] = [];
  //   for(let i=0; i<12; i++) {
  //     //use i+1 for month because when using 0 for days the method will return the last day
  //     //of last month which is what we want to get for number of days of that month
  //     monthSchedules.push(this.generateMonthSchedule(i, year, (new Date(year, i + 1, 0)).getDate()));
  //     secondMonthSchedules.push(this.generateMonthSchedule(i, year + 1, (new Date(year + 1, i + 1, 0)).getDate()));
  //   }
  //   this.currentYearSchedule = new YearSchedule(year, monthSchedules);
  //   this.nextYearSchedule = new YearSchedule(year + 1, secondMonthSchedules);
  //   return this.yearSchedules;
  // }
  //
  // generateMonthSchedule(month: number, year: number, numOfDays:number) {
  //   let daySchedules: DaySchedule[] = [];
  //   for(let i=0; i<numOfDays; i++) {
  //     daySchedules.push(this.generateDaySchedule(i + 1, month, year));
  //   }
  //   return new MonthSchedule(monthes[month], daySchedules);
  // }
  //
  // generateDaySchedule(dayOfMonth: number, month:number, year:number) {
  //   let events = [];
  //   // for(let i=0; i<numOfEvents; i++) {
  //   //   events.push(new CalendarEvent('title ' + (i + 1), new Date(), 'Num ' + (i + 1) + ' event!', 'orange'));
  //   // }
  //   const dayOfWeek = daysOfWeek[(new Date(year, month, dayOfMonth).getDay())];
  //   if(dayOfWeek == 'Tuesday') {
  //     let event = new CalendarEvent('Yichi\'s Advanced Group Training', new Date(year, month, dayOfMonth, 18, 30, 0),
  //                                   new Date(year, month, dayOfMonth, 20, 30, 0), 'High level professional training!', 'green');
  //     events.push(event);
  //   }else if(dayOfWeek == 'Thursday') {
  //     let event = new CalendarEvent('Yichi\'s Advanced Group Training', new Date(year, month, dayOfMonth, 18, 30, 0),
  //                                   new Date(year, month, dayOfMonth, 20, 30, 0), 'High level professional training!', 'green');
  //     events.push(event);
  //     let event2 = new CalendarEvent('Wojtek\'s Group Training', new Date(year, month, dayOfMonth, 17, 30, 0),
  //                                   new Date(year, month, dayOfMonth, 18, 30, 0), 'Fun and intuitive training!', 'dodgerblue');
  //     events.push(event2);
  //   }else if(dayOfWeek == 'Saturday') {
  //     let event = new CalendarEvent('Yichi\'s Advanced Group Training', new Date(year, month, dayOfMonth, 15, 0, 0),
  //                                   new Date(year, month, dayOfMonth, 18, 0, 0), 'High level professional training!', 'green');
  //     events.push(event);
  //   }else if(dayOfWeek == 'Sunday') {
  //     let event = new CalendarEvent('Yichi\'s Advanced Group Training', new Date(year, month, dayOfMonth, 9, 0, 0),
  //                                   new Date(year, month, dayOfMonth, 12, 0, 0), 'High level professional training!', 'green');
  //     events.push(event);
  //   }else if(dayOfWeek == 'Friday') {
  //     let event = new CalendarEvent('Friday League', new Date(year, month, dayOfMonth, 18, 30, 0),
  //                                   new Date(year, month, dayOfMonth, 23, 0, 0), 'Fun and competitive tournament!', 'red');
  //     events.push(event);
  //   }else if(dayOfWeek == 'Wednesday') {
  //     let event = new CalendarEvent('Yichi\'s Beginner Group Training', new Date(year, month, dayOfMonth, 19, 0, 0),
  //                                   new Date(year, month, dayOfMonth, 21, 0, 0), 'Fun and intuitive training!', 'orange');
  //     events.push(event);
  //   }
  //
  //   return new DaySchedule(dayOfMonth, dayOfWeek, month, year, events);
  // }
}
