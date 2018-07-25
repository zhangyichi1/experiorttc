import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CalendarEvent } from '../../models/schedule.model';
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
      width: '550px'
    });
    console.log('in openDialog method and dialogRef is: ', dialogRef);

    dialogRef.afterClosed().subscribe(event => {
      console.log('in afterclosed, new event is: ', event);
      if(event != null && event != undefined) {
        this.createCalendarEvent.emit(event);
      }
    });
  }
}

@Component({
  selector: 'app-event-modal-dialog',
  templateUrl: './event-modal-dialog.component.html',
  styleUrls: ['./event-modal-dialog.component.css']
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

  // endingDateDisabled: boolean;
  minStartingDate: any;
  // minStartingHour: number;
  // minStartingMin: number;
  minEndingDate: any;

  // startingDate: any;
  // startingHour: number;
  // startingMin: number;
  // endingDate: any;
  // endingHour: number;
  // endingMin: number;

  eventForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<EventModalDialogComponent>,
      private formBuilder: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('in dialog constructor and the data is: ', this.data);
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

    // this.startingDate = new Date();
    // this.startingHour = 0;
    // this.startingMin = 0;
    // this.endingDate = new Date();
    // this.endingHour = 0;
    // this.endingMin = 0;

    this.minStartingDate = new Date();
    // this.minStartingHour = new Date().getHours();
    // this.minStartingMin = new Date().getMinutes();
    this.minEndingDate = new Date();

    let currentTime = new Date();
    this.eventForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'description': [''],
      'startingDate': [currentTime, Validators.required],
      'startingHour': [currentTime.getHours(), Validators.required],
      'startingMin': [currentTime.getMinutes(), Validators.required],
      'endingDate': [currentTime, Validators.required],
      'endingHour': [currentTime.getHours(), Validators.required],
      'endingMin': [currentTime.getMinutes(), Validators.required],
      'color': ['dodgerblue', Validators.required]
    })
  }

  // createEvent(form: NgForm) {
  createEvent() {
    console.log('in edit eventForm issssss: ', this.eventForm);
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

  onClose(): void {
    console.log('event creation canceled');
    this.dialogRef.close();
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
