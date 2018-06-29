const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarEventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  startingTime: {
    type: Date,
    required: true
  },
  endingTime: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  color: {
    type: String,
    required: true
  }
});

const dayScheduleSchema = new Schema({
  day: {
    type: Number,
    required: true
  },
  dayOfWeek: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  events: {
    type: [calendarEventSchema],
    required: true
  }
});

const monthScheduleSchema = new Schema({
  month: {
    type: String,
    required: true
  },
  daySchedules: {
    type: [dayScheduleSchema],
    required: true
  }
});

const yearScheduleSchema = new Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  monthSchedules: {
    type: [monthScheduleSchema],
    required: true
  }
});


yearScheduleSchema.methods.updateYearSchedule = function(newYearSchedule, callback) {
  newYearSchedule.save(callback);
};

yearScheduleSchema.methods.deleteEvent = function(month, day, eventIndex, callback) {
  this.monthSchedules[month].daySchedules[day].events[eventIndex].remove();
  this.save(callback);
}

yearScheduleSchema.methods.addEvent = function(month, day, newEvent, callback) {
  // let selectedDay = this.monthSchedules[month].daySchedules[day];
  // selectedDay.events.push(newEvent);
  this.monthSchedules[month].daySchedules[day].events.push(newEvent);
  this.save(callback);
};

const YearSchedule = module.exports = mongoose.model('yearSchedule', yearScheduleSchema, 'testSchedules');
