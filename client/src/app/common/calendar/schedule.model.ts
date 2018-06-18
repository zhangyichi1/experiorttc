export class DaySchedule {

  numOfEvents: number;

  constructor(public day: number, public dayOfWeek: string, public month: number, public year: number, public events: CalendarEvent[] = []) {
    this.numOfEvents = events.length;
  }

  getDay() {
    return this.day;
  }

  getDayOfWeek() {
    return this.dayOfWeek;
  }

  getMonth() {
    return this.month;
  }

  getEvents() {
    return this.events;
  }

  getNumOfEvents() {
    return this.numOfEvents;
  }

  addEvent(calendarEvent: CalendarEvent) {
    this.events.push(calendarEvent);
    this.numOfEvents++;
  }
}

export class MonthSchedule {

  constructor(public month: string, public daySchedules: DaySchedule[] = []) {}

  getMonth() {
    return this.month;
  }

  setMonth(month: string) {
    this.month = month;
  }

  getDaySchedules() {
    return this.daySchedules;
  }

}

export class YearSchedule {

  constructor(public year: number, public monthSchedules: MonthSchedule[] = []) {}

  getMonthSchedules() {
    return this.monthSchedules;
  }

  getYear() {
    return this.year;
  }

  setYear(year: number) {
    this.year = year;
  }

}

export class CalendarEvent {

  constructor(public title: string, public startingTime: Date, public endingTime: Date, public description: string, public color: string) {}

  getTitle() {
    return this.title;
  }

  getStartingTime() {
    return this.startingTime;
  }

  getEndingTime() {
    return this.endingTime
  }

  getDescription() {
    return this.description;
  }

  getColor() {
    return this.color;
  }

  // getParticipants() {
  //   return this.participants;
  // }
  //
  // addParticipants(newParticipant: string) {
  //   this.participants.push(newParticipant);
  // }

}
