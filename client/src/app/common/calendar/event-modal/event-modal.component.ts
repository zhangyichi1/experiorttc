import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalendarEvent } from '../schedule.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent implements OnInit {

  @Output() createCalendarEvent: EventEmitter<CalendarEvent> = new EventEmitter();

  constructor(public dialog: MatDialog) {
                console.log('in modal constructor and dialog is: ', this.dialog);
              }

  ngOnInit() {}

  openDialog(): void {
    console.log('in openDialog method before open dialog');
    let dialogRef = this.dialog.open(EventModalDialogComponent, {
      width: '550px',
      // height: '550px',
      // data: { newEvent: this.newEvent }
    });
    console.log('in openDialog method and dialogRef is: ', dialogRef);

    dialogRef.afterClosed().subscribe(event => {
      console.log('in afterclosed, new event is: ', event);
      this.createCalendarEvent.emit(event);
    });
  }
}

@Component({
  selector: 'app-event-modal-dialog',
  templateUrl: 'event-modal-dialog.component.html',
})
export class EventModalDialogComponent {

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

  endingDateDisabled: boolean;
  minStartingDate: any;
  minStartingHour: number;
  minStartingMin: number;
  minEndingDate: any;

  startingDate: any;
  startingHour: number;
  startingMin: number;
  endingDate: any;
  endingHour: number;
  endingMin: number;

  constructor(
    public dialogRef: MatDialogRef<EventModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('in dialog constructor and the data is: ', this.data);
      this.endingDateDisabled = false;
    }

  ngOnInit() {
    //set up options for minutes select
    for(let i=0; i<60; i++) {
      if(i < 10) {
        this.minOptions.push({
          value: i,
          viewValue: ':0' + i
        })
      }else {
        this.minOptions.push({
          value: i,
          viewValue: ':' + i
        })
      }
    }
    //set up options for hours select
    for(let i=0; i<24; i++) {
      if(i < 10) {
        this.hourOptions.push({
          value: i,
          viewValue: '0' + i + ':'
        })
      }else {
        this.hourOptions.push({
          value: i,
          viewValue: i + ':'
        })
      }
    }
    this.initForm();
  }

  initForm() {

    this.startingDate = new Date();
    this.startingHour = 0;
    this.startingMin = 0;
    this.endingDate = new Date();
    this.endingHour = 0;
    this.endingMin = 0;

    this.minStartingDate = new Date();
    // this.minStartingHour = new Date().getHours();
    // this.minStartingMin = new Date().getMinutes();
    this.minEndingDate = new Date();
  }

  createEvent(form: NgForm) {
    console.log('in edit eventForm issssss: ', form);
    let startingTime = new Date(form.value.startingDate.getFullYear(),
                                form.value.startingDate.getMonth(),
                                form.value.startingDate.getDate(),
                                form.value.startingHour,
                                form.value.startingMin,
                                0);
    let endingTime = new Date(form.value.endingDate.getFullYear(),
                              form.value.endingDate.getMonth(),
                              form.value.endingDate.getDate(),
                              form.value.endingHour,
                              form.value.endingMin,
                              0);
    const newEvent = new CalendarEvent(form.value.title,
                     startingTime, endingTime,
                     form.value.description, form.value.color);
    this.dialogRef.close(newEvent);
  }

  onClose(): void {
    console.log('event creation canceled');
    this.dialogRef.close();
  }

  checkingEndingDate() {
    if(this.startingDate == null || this.startingDate == '' || this.startingDate == undefined) {
      this.endingDateDisabled = true;
      console.log('startingDate is null!!!');
    }else {
      this.endingDateDisabled = false;
      this.minEndingDate = this.startingDate;
      if(this.endingDate == undefined || this.endingDate == null || this.endingDate < this.startingDate) {
        this.endingDate = this.startingDate;
      }
      if(this.endingDate.getTime() == this.startingDate.getTime()) {
        if(this.endingHour < this.startingHour) {
          this.endingHour = this.startingHour;
        }else if(this.endingHour == this.startingHour) {
          if(this.endingMin < this.startingMin) {
            this.endingMin = this.startingMin;
          }
        }
      }
    }
  }
}
