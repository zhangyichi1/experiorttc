import { Component, OnInit, Inject } from '@angular/core';
import { DaySchedule, MonthSchedule, YearSchedule, CalendarEvent } from '../models/schedule.model';
import { CalendarService } from '../services/calendar.service';
import { EventService } from '../services/event.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute, Data } from '@angular/router';

const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  // yearSchedules: YearSchedule[];

  date: Date;

  //the year schedule for the year of this day
  currentYearSchedule: YearSchedule;
  //the year schedule for the next year
  nextYearSchedule: YearSchedule;
  //an array of month schedules for the year of the page currently being viewed
  monthSchedules: MonthSchedule[];
  //the month number of the page that is currently being viewed, 0 based
  currentMonth: number;
  //the year number of the page that is currently being viewed
  currentViewYear: number;
  //the month schedule for the page that is currently being viewed
  currentViewMonthSchedule: MonthSchedule;
  //the month schedule for the next month of the page that is currently being viewed
  previousViewMonthSchedule: MonthSchedule;
  //the month schedule for the previous month of the page that is currently being viewed
  nextViewMonthSchedule: MonthSchedule;
  //an array that's finally used to display the view, contains possibly few days of previous month and next month
  currentMonthView: DaySchedule[][];

  constructor(private calendarService: CalendarService,
              private eventService: EventService,
              private dialog: MatDialog,
              private flashMessages: FlashMessagesService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.date = new Date();
    if(this.calendarService.checkYearSchedules()) {
      console.log('11111111');
      this.currentYearSchedule = this.calendarService.getCurrentYearSchedule();
      this.nextYearSchedule = this.calendarService.getNextYearSchedule();

      // this.currentYearSchedule = data.yearSchedules[0];
      // this.nextYearSchedule = data.yearSchedules[1];
      console.log('currentYearSchedule is: ', this.currentYearSchedule);
      console.log('nextYearSchedule is: ', this.nextYearSchedule);
      this.currentViewYear = this.currentYearSchedule.year;
      // console.log('currentViewYear is: ', this.currentViewYear);
      //monthSchedules is the schedules of the 12 monthes of the year of current view
      this.monthSchedules = this.currentYearSchedule.monthSchedules;
      // console.log('monthSchedules are: ', this.monthSchedules);
      this.currentMonth = new Date().getMonth();
      // console.log('currentMonth is: ', this.currentMonth);
      // currentMonthSchedule is the schdule for the current month
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth]
      // console.log('currentViewMonthSchedule is: ', this.currentViewMonthSchedule);

      //set up previousMonthSchedule and nextMonthSchedule
      //if the currentMonth is Jan then the preMonth will be Dec of last year
      //if the currentMonth is Dec then the nextMonth will be Jan of next year
      if(this.currentMonth > 0 && this.currentMonth < 11) {
        this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
        this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];
        // console.log('previousViewMonthSchedule is: ', this.previousViewMonthSchedule);
        // console.log('nextViewMonthSchedule is: ', this.nextViewMonthSchedule);
      }else if(this.currentMonth == 0){
        //set previousViewMonthSchedule to null since it's always the currentYear here
        this.previousViewMonthSchedule = null;
        this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];
        // console.log('previousViewMonthSchedule is: ', this.previousViewMonthSchedule);
        // console.log('nextViewMonthSchedule is: ', this.nextViewMonthSchedule);
      }else if(this.currentMonth == 11){
        //get January schedule of next year and in constructor it shouldn't be null
        //because calendar for the second year should always be available;
        this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
        this.nextViewMonthSchedule = this.nextYearSchedule.monthSchedules[0];
        // console.log('previousViewMonthSchedule is: ', this.previousViewMonthSchedule);
        // console.log('nextViewMonthSchedule is: ', this.nextViewMonthSchedule);
      }

      this.currentMonthView = [];
      this.setCurrentMonthView();
      // console.log('currentMonthView is: ', this.currentMonthView);
    }else {
    console.log('22222222');
    //currentYear is the year for the current time
    //nextYear is the future year
    this.route.data.subscribe((data: Data) => {
      console.log('data is: ', data)
      this.currentYearSchedule = data.yearSchedules.yearSchedules.yearSchedules[0];
      this.nextYearSchedule = data.yearSchedules.yearSchedules.yearSchedules[1];
      // this.currentYearSchedule = new YearSchedule(data.yearSchedules.yearSchedules.currentYearSchedule.year, data.yearSchedules.yearSchedules.currentYearSchedule.monthSchedules);
      // this.nextYearSchedule = new YearSchedule(data.yearSchedules.yearSchedules.nextYearSchedule.year, data.yearSchedules.yearSchedules.nextYearSchedule.monthSchedules);
      console.log('currentYearSchedule is: ', this.currentYearSchedule);
      console.log('nextYearSchedule is: ', this.nextYearSchedule);

      this.calendarService.setCurrentYearSchedule(this.currentYearSchedule);
      this.calendarService.setNextYearSchedule(this.nextYearSchedule);

      // this.currentYearSchedule = data.yearSchedules[0];
      // this.nextYearSchedule = data.yearSchedules[1];
      // console.log('currentYearSchedule is: ', this.currentYearSchedule);
      // console.log('nextYearSchedule is: ', this.nextYearSchedule);
      this.currentViewYear = this.currentYearSchedule.year;
      // console.log('currentViewYear is: ', this.currentViewYear);
      //monthSchedules is the schedules of the 12 monthes of the year of current view
      this.monthSchedules = this.currentYearSchedule.monthSchedules;
      // console.log('monthSchedules are: ', this.monthSchedules);
      this.currentMonth = new Date().getMonth();
      // console.log('currentMonth is: ', this.currentMonth);
      // currentMonthSchedule is the schdule for the current month
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth]
      // console.log('currentViewMonthSchedule is: ', this.currentViewMonthSchedule);

      //set up previousMonthSchedule and nextMonthSchedule
      //if the currentMonth is Jan then the preMonth will be Dec of last year
      //if the currentMonth is Dec then the nextMonth will be Jan of next year
      if(this.currentMonth > 0 && this.currentMonth < 11) {
        this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
        this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];
        // console.log('previousViewMonthSchedule is: ', this.previousViewMonthSchedule);
        // console.log('nextViewMonthSchedule is: ', this.nextViewMonthSchedule);
      }else if(this.currentMonth == 0){
        //set previousViewMonthSchedule to null since it's always the currentYear here
        this.previousViewMonthSchedule = null;
        this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];
        // console.log('previousViewMonthSchedule is: ', this.previousViewMonthSchedule);
        // console.log('nextViewMonthSchedule is: ', this.nextViewMonthSchedule);
      }else if(this.currentMonth == 11){
        //get January schedule of next year and in constructor it shouldn't be null
        //because calendar for the second year should always be available;
        this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
        this.nextViewMonthSchedule = this.nextYearSchedule.monthSchedules[0];
        // console.log('previousViewMonthSchedule is: ', this.previousViewMonthSchedule);
        // console.log('nextViewMonthSchedule is: ', this.nextViewMonthSchedule);
      }

      this.currentMonthView = [];
      this.setCurrentMonthView();
      // console.log('currentMonthView is: ', this.currentMonthView);
    });
    }
    //
    // this.eventService.addCalendarEvent.subscribe((newSchedule) => {
    //   console.log('in calendar component', newSchedule);
    //   if(newSchedule.year == this.currentYearSchedule.year) {
    //     // this.currentYearSchedule.monthSchedules[newSchedule.month].daySchedules[newSchedule.day].events.push(newSchedule.event);
    //     this.currentYearSchedule.monthSchedules[newSchedule.month].daySchedules[newSchedule.day] = newSchedule.updatedDaySchedule;
    //   }else {
    //     // this.nextYearSchedule.monthSchedules[newSchedule.month].daySchedules[newSchedule.day].events.push(newSchedule.event);
    //     this.nextYearSchedule.monthSchedules[newSchedule.month].daySchedules[newSchedule.day] = newSchedule.updatedDaySchedule;
    //   }
    //   // console.log('in calendar component currentYearSchedule is: ', this.currentYearSchedule);
    //   // console.log('in calendar component nextYearSchedule is: ', this.nextYearSchedule);
    //   this.setCurrentMonthView();
    // })
  }

  // addCalendar() {
  //   console.log('in calendar component currentYearSchedule is: ', this.currentYearSchedule);
  //   console.log('in calendar component nextYearSchedule: ', this.nextYearSchedule);
  //   this.calendarService.addClendar(this.currentYearSchedule).subscribe((data) => {
  //     // console.log('data is: ', data);
  //     if(data.success) {
  //       this.flashMessages.show('successfully add calendar of current year', { cssClass: 'alert-success', timeout: 3000 });
  //     }else {
  //       this.flashMessages.show('wwwwwhat11111', { cssClass: 'alert-danger', timeout: 3000 });
  //     }
  //   });
  //   this.calendarService.addClendar(this.nextYearSchedule).subscribe((data) => {
  //     // console.log('data is: ', data);
  //     if(data.success) {
  //       this.flashMessages.show('successfully add calendar of new year', { cssClass: 'alert-success', timeout: 3000 });
  //     }else {
  //       this.flashMessages.show('wwwwwhat22222', { cssClass: 'alert-danger', timeout: 3000 });
  //     }
  //   });
  // }

  //this method is used to set up the view for calendar page
  setCurrentMonthView() {
    //these three objects are three arrays that contain all the daySchedules
    let currentMonthObj = this.currentViewMonthSchedule.daySchedules;
    let preMonthObj = this.previousViewMonthSchedule == null ? null : this.previousViewMonthSchedule.daySchedules;
    let nextMonthObj = this.nextViewMonthSchedule == null ? null : this.nextViewMonthSchedule.daySchedules;

    //firstDay is used to determin how many days of last month will show up
    //on the current view, lastDay is used to determin how many days of next
    //month will show up on the current view
    let firstDay = currentMonthObj[0].dayOfWeek;
    let daysOfPreMonth = 0;
    let lastDay = currentMonthObj[currentMonthObj.length - 1].dayOfWeek;
    let daysOfNextMonth = 0;

    if(firstDay == 'Monday') {
      daysOfPreMonth = 1;
    }else if(firstDay == 'Tuesday') {
      daysOfPreMonth = 2;
    }else if(firstDay == 'Wednesday') {
      daysOfPreMonth = 3;
    }else if(firstDay == 'Thursday') {
      daysOfPreMonth = 4;
    }else if(firstDay == 'Friday') {
      daysOfPreMonth = 5;
    }else if(firstDay == 'Saturday') {
      daysOfPreMonth = 6;
    }

    if(lastDay == 'Sunday') {
      daysOfNextMonth = 6;
    }else if(lastDay == 'Monday') {
      daysOfNextMonth = 5;
    }else if(lastDay == 'Tuesday') {
      daysOfNextMonth = 4;
    }else if(lastDay == 'Wednesday') {
      daysOfNextMonth = 3;
    }else if(lastDay == 'Thursday') {
      daysOfNextMonth = 2;
    }else if(lastDay == 'Friday') {
      daysOfNextMonth = 1;
    }

    console.log('cmobj is: ', currentMonthObj);
    if(currentMonthObj.length == 28 && firstDay == 'Sunday') {
      //get 4 rows of schedules
      console.log('im in first if');
      this.setWeekSchedules(preMonthObj, currentMonthObj, nextMonthObj, daysOfPreMonth, daysOfNextMonth, 4);
    }else if((currentMonthObj.length == 30 && firstDay == 'Saturday') ||
             (currentMonthObj.length == 31 && (firstDay == 'Friday' || firstDay == 'Saturday'))) {
      //get 6 rows of schedules
      console.log('im in second if');
      this.setWeekSchedules(preMonthObj, currentMonthObj, nextMonthObj, daysOfPreMonth, daysOfNextMonth, 4);
    }else {
      //get 5 rows of schedules
      console.log('im in fourth if');
      this.setWeekSchedules(preMonthObj, currentMonthObj, nextMonthObj, daysOfPreMonth, daysOfNextMonth, 3);
    }
  }

  //this method is used to set up weekSchedule which is a row of daySchedule
  //in the view
  setWeekSchedules(preMonthObj: DaySchedule[], currentMonthObj: DaySchedule[],
    nextMonthObj: DaySchedule[], daysOfPreMonth: number,
    daysOfNextMonth: number, numOfWeeks: number) {
      let i = 0;
      let weekView = [];
      this.currentMonthView = [];

      if(preMonthObj == null) {
        for(let k=0; k<daysOfPreMonth; k++) {
          weekView.push(new DaySchedule(31 - daysOfPreMonth + 1 + k, daysOfWeek[k], 11, new Date().getFullYear() - 1));
        }
      }else {
        for(let k=0; k<daysOfPreMonth; k++) {
          weekView.push(preMonthObj[preMonthObj.length - daysOfPreMonth + k]);
        }
      }

      for(let k=0; k<7-daysOfPreMonth; k++) {
        weekView.push(currentMonthObj[i]);
        i++;
      }
      this.currentMonthView.push(weekView);
      weekView = [];
      for(let j=0; j<numOfWeeks; j++) {
        for(let k=0; k<7; k++) {
          weekView.push(currentMonthObj[i]);
          i++;
        }
        this.currentMonthView.push(weekView);
        weekView = [];
      }
      for(let k=0; k<7-daysOfNextMonth; k++) {
        weekView.push(currentMonthObj[i]);
        i++;
      }
      if(nextMonthObj == null) {
        // console.log('im here');
        for(let k=0; k<daysOfNextMonth; k++) {
          weekView.push(new DaySchedule(k + 1, daysOfWeek[7 - daysOfNextMonth], 0, new Date().getFullYear() + 1));
        }
      }else {
        for(let k=0; k<daysOfNextMonth; k++) {
          weekView.push(nextMonthObj[k]);
        }
      }
      this.currentMonthView.push(weekView);
      console.log('currentMonthView is: ', this.currentMonthView);
      //set weekView to empty here in order to not getting duplicate data
      //when call setCurrentMonthView again
      weekView = [];
      // console.log('this.setCurrentMonthView is: ', this.currentMonthView);
    }

  preMonth() {
    // console.log("currentMonth is: ", this.currentMonthSchedule.getMonth());
    // console.log("currentYear is: ", this.currentYearSchedule.getYear());

    //check if current page is January of future year
    //if yes change the all related variables
    //if it's January of currentYear then do nothing
    //else we change some variables only

    // if(this.currentViewMonthSchedule.getMonth() == 'January' && (this.yearSchedules[0].getYear() < this.currentYearSchedule.getYear())) {
    if(this.currentMonth == 0 && (this.currentViewYear == this.nextYearSchedule.year)) {
      // console.log('hahaha');
      // this.currentYearSchedule = this.yearSchedules[0];
      this.currentViewYear = this.currentYearSchedule.year;
      this.monthSchedules = this.currentYearSchedule.monthSchedules;

      this.currentMonth = 11;
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth];

      this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
      this.nextViewMonthSchedule = this.nextYearSchedule.monthSchedules[0];

      this.currentMonthView = [];
      this.setCurrentMonthView();
    }else if(this.currentMonth == 0 && (this.currentViewYear == this.currentYearSchedule.year)){
      console.log('There is no record of last year\'s calendar! ');
    }else if(this.currentMonth == 1) {
      // this.currentMonth = this.currentMonth - 1;
      this.currentMonth = this.currentMonth - 1;
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth];

      // this.previousMonthSchedule = (this.currentMonth == 0 && (this.yearSchedules[0].getYear() < this.currentYearSchedule.getYear())) ? null : this.monthSchedules[this.currentMonth - 1];
      if(this.currentViewYear == this.currentYearSchedule.year) {
        //set preMonth to null and nextMonth to Feb of current year
        this.previousViewMonthSchedule = null;
        this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];
      }else if(this.currentViewYear == this.nextYearSchedule.year) {
        //set preMonth to Dec of current year and nextMonth to Feb of next year
        this.previousViewMonthSchedule = this.currentYearSchedule.monthSchedules[11];
        this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1]
      }else {
        console.log('something went wrong');
      }

      this.currentMonthView = [];
      this.setCurrentMonthView();
    }else {
      //set preMonth to currentMonthSchedule - 1 and nextMonth to currentMonthSchedule + 1
      this.currentMonth = this.currentMonth - 1;
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth];
      this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
      this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];

      this.currentMonthView = [];
      this.setCurrentMonthView();
    }
  }

  nextMonth() {
    if(this.currentMonth == 11 && (this.currentViewYear == this.currentYearSchedule.year)) {
      // this.currentYearSchedule = this.yearSchedules[1];
      this.currentViewYear = this.nextYearSchedule.year;
      this.monthSchedules = this.nextYearSchedule.monthSchedules;

      this.currentMonth = 0;
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth];

      this.previousViewMonthSchedule = this.currentYearSchedule.monthSchedules[11];
      this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];

      this.currentMonthView = [];
      this.setCurrentMonthView();
    }else if(this.currentMonth == 11 && (this.currentViewYear == this.nextYearSchedule.year)) {
      console.log('There is no record of last year\'s calendar! ');
    }else if(this.currentMonth == 10) {
      this.currentMonth = this.currentMonth + 1;
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth];

      if(this.currentViewYear == this.currentYearSchedule.year) {
        //set premonth to Nov of current year and nextmonth to Jan of next year
        this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
        this.nextViewMonthSchedule = this.nextYearSchedule.monthSchedules[0];
      }else if(this.currentViewYear == this.nextYearSchedule.year) {
        //set premonth to Nov of current year and nextmonth to null
        this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
        this.nextViewMonthSchedule = null;
      }else {
        console.log('something went wrong');
      }

      this.currentMonthView = [];
      this.setCurrentMonthView();
    }else {
      //set preMonth to currentMonthSchedule - 1 and nextMonth to currentMonthSchedule + 1
      this.currentMonth = this.currentMonth + 1;
      this.currentViewMonthSchedule = this.monthSchedules[this.currentMonth];
      this.previousViewMonthSchedule = this.monthSchedules[this.currentMonth - 1];
      this.nextViewMonthSchedule = this.monthSchedules[this.currentMonth + 1];

      this.currentMonthView = [];
      this.setCurrentMonthView();
    }
  }

  isCurrentMonth(month: number) {
    if(month == this.currentMonth) {
      return true;
    }else {
      return false;
    }
  }

  addEvent(event) {
    console.log('event is: ', event);
    //get event time from event and check if it's beyond the range, if yes show warning msg
    if(event != null && event != undefined) {
      let date = event.startingTime;
      console.log('date is: ', date);
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate() - 1;
      if(date.getFullYear() > this.nextYearSchedule.year) {
        this.flashMessages.show('you can\'t add calendar event in two years ', { cssClass: 'alert-danger', timeout: 5000 });
        return;
      }else if(date.getFullYear() < this.currentYearSchedule.year) {
        //should never reach here since picking date before current date is disabled
        this.flashMessages.show('you can\'t add calendar event before current year ', { cssClass: 'alert-danger', timeout: 5000 });
        return;
      }
      //call calendarService's addEvent method to complete the addition, if success set specified
      //daySchedule to updatedDaySchedule and reset the view
      this.calendarService.addEvent(event, year, month, day).subscribe((data) => {
      if(data.status == 401) {
        this.flashMessages.show('Please sign in to add calendar event!', { cssClass: 'alert-danger', timeout: 5000 });
      }else {
        console.log('in addEvent data is: ', data);
        if(data.success) {
          if(year == this.currentYearSchedule.year) {
            this.currentYearSchedule.monthSchedules[month].daySchedules[day] = data.updatedDaySchedule;
          }else {
            this.nextYearSchedule.monthSchedules[month].daySchedules[day] = data.updatedDaySchedule;
          }
          this.setCurrentMonthView();
        }else {
          this.flashMessages.show(data.message, { cssClass: 'alert-danger', timeout: 5000 });
        }
      }});
    }else {
      console.log('in addEvent event is NULL!');
    }
  }

  //use material dialog module to build a dialog component
  //get daySchedule object and pass it to the dialog component
  openDialog(daySchedule) {
    let dialogRef = this.dialog.open(EventEditModalDialogComponent, {
      width: '550px',
      data: {
        daySchedule: daySchedule
      }
    });
    console.log('in edit openDialog: ', dialogRef);

    //
    dialogRef.afterClosed().subscribe(event => {
      console.log('in afterclosed, new event is: ', event);
      if(event != null && event != undefined) {
        this.addEvent(event);
      }
    });
  }
}


@Component({
  selector: 'app-event-edit-modal-dialog',
  templateUrl: './event-edit-modal-dialog.component.html',
  styleUrls: ['./event-edit-modal-dialog.component.css']
})
export class EventEditModalDialogComponent {

  colorOptions = [
    { value: 'red', viewValue: 'red' },
    { value: 'violet', viewValue: 'violet' },
    { value: 'green', viewValue: 'green' },
    { value: 'dodgerblue', viewValue: 'dodgerblue' },
    { value: 'orange', viewValue: 'orange' },
    { value: 'lightgray', viewValue: 'lightgray' }
  ]

  hourOptions = []

  minOptions = []

  events: any[] = [];
  editMode: boolean;
  // endingDateDisabled: boolean;
  minStartingDate: any;
  minStartingHour: number;
  minStartingMin: number;
  minEndingDate: any;

  startingDate: Date;
  // startingHour: number;
  // startingMin: number;
  endingDate: Date;
  // endingHour: number;
  // endingMin: number;

  eventForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EventEditModalDialogComponent>,
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private flashMessages: FlashMessagesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('in edit dialog constructor and the data is: ', this.data);
      // this.endingDateDisabled = false;
    }

  ngOnInit() {
    //set up options for minutes select
    for(let i=0; i<60; i++) {
      if(i < 10) {
        this.minOptions.push({
          value: i,
          viewValue: '0' + i
        })
      }else {
        this.minOptions.push({
          value: i,
          viewValue: i
        })
      }
    }
    //set up options for hours select
    for(let i=0; i<24; i++) {
      if(i < 10) {
        this.hourOptions.push({
          value: i,
          viewValue: '0' + i
        })
      }else {
        this.hourOptions.push({
          value: i,
          viewValue: i
        })
      }
    }
    this.initForm();
  }

  initForm() {
    //preprocess the data and check to see if there's any event for this day

    this.minStartingDate = new Date();
    this.minEndingDate = new Date();

    this.startingDate = new Date(this.data.daySchedule.month + 1 + '/' + this.data.daySchedule.day + '/' + this.data.daySchedule.year);
    // this.startingHour = 0;
    // this.startingMin = 0;
    this.endingDate = new Date(this.data.daySchedule.month + 1 + '/' + this.data.daySchedule.day + '/' + this.data.daySchedule.year);
    // this.endingHour = 0;
    // this.endingMin = 0;

    if(this.startingDate.getTime() < Date.now()) {
      this.startingDate = new Date();
      this.endingDate = new Date();
    }

    let currentTime = new Date();
    this.eventForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'description': [''],
      'startingDate': [this.startingDate, Validators.required],
      'startingHour': [currentTime.getHours(), Validators.required],
      'startingMin': [currentTime.getMinutes(), Validators.required],
      'endingDate': [this.endingDate, Validators.required],
      'endingHour': [currentTime.getHours(), Validators.required],
      'endingMin': [currentTime.getMinutes(), Validators.required],
      'color': ['dodgerblue', Validators.required]
    })

    if(this.data.daySchedule.events.length == 0) {
      this.editMode = false;
    }else {
      this.editMode = true;
      for(let i=0; i<this.data.daySchedule.events.length; i++) {
        let title = this.data.daySchedule.events[i].title;
        let startingTime = this.formatDate(new Date(this.data.daySchedule.events[i].startingTime));
        let endingTime = this.formatDate(new Date(this.data.daySchedule.events[i].endingTime));
        let description = this.data.daySchedule.events[i].description;
        let color = this.data.daySchedule.events[i].color;
        this.events.push({
          title: title,
          startingTime: startingTime,
          endingTime: endingTime,
          description: description,
          color: color
        });
      }
      console.log('in init events are: ', this.events);
    }
  }

  formatDate(date: Date): string {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour: any = date.getHours();
    if(hour < 10) {
      hour = '0' + hour;
    }
    let min: any = date.getMinutes();
    if(min < 10) {
      min = '0' + min;
    }
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
  }

  createEvent() {
    console.log('eventForm is: ', this.eventForm);
    // let startingTime = new Date(form.value.startingDate.getFullYear(),
    //                             form.value.startingDate.getMonth(),
    //                             form.value.startingDate.getDate(),
    //                             form.value.startingHour,
    //                             form.value.startingMin,
    //                             0);
    // let endingTime = new Date(form.value.endingDate.getFullYear(),
    //                           form.value.endingDate.getMonth(),
    //                           form.value.endingDate.getDate(),
    //                           form.value.endingHour,
    //                           form.value.endingMin,
    //                           0);
    let startingTime = new Date(this.eventForm.value.startingDate.getFullYear(),
                                this.eventForm.value.startingDate.getMonth(),
                                this.eventForm.value.startingDate.getDate(),
                                this.eventForm.value.startingHour,
                                this.eventForm.value.startingMin,
                                0);
    let endingTime = new Date(this.eventForm.value.endingDate.getFullYear(),
                              this.eventForm.value.endingDate.getMonth(),
                              this.eventForm.value.endingDate.getDate(),
                              this.eventForm.value.endingHour,
                              this.eventForm.value.endingMin,
                              0);
    // const newEvent = new CalendarEvent(form.value.title,
    //                  startingTime, endingTime,
    //                  form.value.description, form.value.color);
    const newEvent = new CalendarEvent(this.eventForm.value.title,
                     startingTime, endingTime,
                     this.eventForm.value.description, this.eventForm.value.color);
    this.dialogRef.close(newEvent);
  }

  onRemove(event, eventIndex) {
    console.log('beginning events are: ', this.events);
    let timeParams = event.startingTime.split(" ")[0].split("-");
    let year = Number(timeParams[0]);
    let month = Number(timeParams[1]) - 1;
    let day = Number(timeParams[2]) - 1;

    this.calendarService.deleteEvent(year, month, day, eventIndex).subscribe((data) => {
      console.log("data is: ", data);
      if(data.status == 401) {
        this.flashMessages.show('Please sign in to remove calendar event!', { cssClass: 'alert-danger', timeout: 5000 });
      }else {
        if(data.success) {
          this.events.splice(eventIndex, 1);
          if(this.events.length == 0) {
            this.editMode = false;
          }
        }
      }
    })
  }

  onClose(): void {
    console.log('in edit event creation canceled');
    this.dialogRef.close(null);
  }

  addEvent() {
    this.editMode = false;
  }

  checkingEndingDate() {
    // console.log('eventForm is: ', this.eventForm);
    let value = this.eventForm.value;
    if(value.startingDate == null || value.startingDate == '' || value.startingDate == undefined || this.eventForm.get('startingDate').invalid) {
      // this.endingDateDisabled = true;
      this.changeEndingDate(true);
    }else {
      // this.endingDateDisabled = false;
      this.changeEndingDate(false);
      this.minEndingDate = value.startingDate;
      if(value.endingDate == undefined || value.endingDate == null || value.endingDate < value.startingDate || this.eventForm.get('endingDate').invalid) {
        // value.endingDate = value.startingDate;
        this.eventForm.patchValue({'endingDate': value.startingDate});
      }
      // if(value.endingDate.getTime() == value.startingDate.getTime()) {
      if(this.eventForm.get('endingDate').value.getTime() <= this.eventForm.get('startingDate').value.getTime()) {

        if(value.endingHour < value.startingHour) {
          // value.endingHour = value.startingHour;
          this.eventForm.patchValue({'endingHour': value.startingHour});
        }else if(value.endingHour == value.startingHour) {
          if(value.endingMin < value.startingMin) {
            // value.endingMin = value.startingMin;
            this.eventForm.patchValue({'endingMin': value.startingMin});
          }
        }
      }
    }
  }

  changeEndingDate(bool: boolean) {
    if(bool) {
      this.eventForm.get('startingHour').disable();
      this.eventForm.get('startingMin').disable();
      this.eventForm.get('endingDate').disable();
      this.eventForm.get('endingHour').disable();
      this.eventForm.get('endingMin').disable();
    }else {
      this.eventForm.get('startingHour').enable();
      this.eventForm.get('startingMin').enable();
      this.eventForm.get('endingDate').enable();
      this.eventForm.get('endingHour').enable();
      this.eventForm.get('endingMin').enable();
    }
  }

  getStartingDateErrorMessage() {
    return this.eventForm.get('startingDate').hasError('matDatepickerParse') ? "Please enter a valid date" :
      this.eventForm.get('startingDate').hasError('required') ? "Starting date is required" :
      this.eventForm.get('startingDate').hasError('matDatepickerMin') ? "Please select a date greater than or equal to today" : "";
  }

  getEndingDateErrorMessage() {
    return this.eventForm.get('endingDate').hasError('matDatepickerParse') ? "Please enter a valid date" :
      this.eventForm.get('endingDate').hasError('required') ? "Ending date is required" :
      this.eventForm.get('endingDate').hasError('matDatepickerMin') ? "Please select a date greater than or equal to starting date" : "";
  }
}
