const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../model/user');
const YearSchedule = require('../model/schedule');
const config = require('../config/database');
const util = require('../controllers/util');

// this method is for user sign up
module.exports.signUp = function(req, res) {
  // check if the required fields are in the body of request
  if(req.body.email == undefined || req.body.email == null || req.body.email == '' || req.body.username == undefined || req.body.username == null || req.body.username == ''
  || req.body.password == undefined || req.body.password == null || req.body.password == '' || req.body.roles == undefined || req.body.roles == null || req.body.roles == '') {
    res.json({ success: false, message: 'User information is not complete' });
  }else if(!util.validateEmail(req.body.email)) {
    // check if email is in valid form
    res.json({ success: false, message: 'The email entered is invalid' })
  }else {
    //create a new User model and setup the fields
    let newUser = new User();
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.roles = req.body.roles;
    if(req.body.address != null && req.body.address != undefined) {
      newUser.address = req.body.address;
    }else {
      newUser.address = '';
    }
    if(req.body.phone != null && req.body.phone != undefined) {
      newUser.phone = req.body.phone;
    }else {
      newUser.phone = '';
    }
    console.log('new user is: ', newUser);
    // Call User model's static method addUser to try to add this user to database
    // if succeed set the expiration time of jwt token to 1h and return a json with
    // the jwt token and user object
    User.addUser(newUser, (err, user) => {
      if(err) {
        res.json({ success: false, message: 'Email already exists, please sign in!' });
      }else if(user){
        console.log('password is: ', user.password);
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: '1h'
        });
        res.json({
          success: true,
          token: 'Bearer ' + token,
          user: {
            email: user.email,
            username: user.username,
            address: user.address,
            phone: user.phone,
            roles: user.roles
          }
        });
      }else {
        // something unexpected happened
        res.json({ success: false, message: 'Registration failed' });
      }
    })
  }
};

// this method is for user sign in
module.exports.signIn = function(req, res) {
  // check for required fields in body of request
  if(req.body.email == undefined || req.body.email == null || req.body.email == ''
  || req.body.password == undefined || req.body.password == null || req.body.password == '') {
    res.json({ success: false, message: 'User information is not complete' });
  }else if(!util.validateEmail(req.body.email)) {
    res.json({ success: false, message: 'The email entered is invalid' })
  }else {
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
      if(err) {
        res.json({ success: false, message: err });
      }
      if(!user) {
        res.json({ success: false, message: 'User not found' })
      }else {
        User.comparePassword(password, user.password, (err, valid) => {
          if(err) {
            res.json({ success: false, message: 'There\'re some issues with the password (does not mean it\'s invalid)' });
          }
          if(valid) {
            console.log('user is: ', user);
            console.log('user roles are: ', user.roles);
            const token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: '1h'
            });
            res.json({
              success: true,
              token: 'Bearer ' + token,
              user: {
                email: user.email,
                username: user.username,
                address: user.address,
                phone: user.phone,
                roles: user.roles
              }
            });
          }else {
            res.json({ success: false, message: 'Password is invalid' });
          }
        });
      }
    });
  }
};

module.exports.getUser = function(req, res) {
  // res.json({ user: req.user });
  res.json({ user: {
    email: 'temp@temp.com',
    username: 'temp'
  }});
};

module.exports.getUsers = function(req, res) {
  res.json({
    something: 'something'
  })
}

module.exports.updateUser = function(req, res) {
  let body = req.body;
  if(body.email == undefined || body.email == null || body.email == '' ||
     body.username == undefined || body.username == null || body.username == '' ||
     body.address == undefined || body.address == null ||
     body.phone == undefined || body.phone == null) {
       res.json({ success: false, message: 'The information of updatedUser is not complete' });
  }else {
    User.findOne({ email: body.email }, (err, user) => {
      if(err) {
        res.json({ success: false, message: err })
      }
      if(!user) {
        res.json({ success: false, message: 'User not found' });
      }else {
        user.update(body, (err, returnedUser) => {
          if(err) {
            res.json({ success: false, message: err });
          }
          if(!returnedUser) {
            res.json({ success: false, message: 'User not updated due to some reasons, please try again' });
          }
          let updatedUser = new Object();
          updatedUser.email = returnedUser.email;
          updatedUser.username = returnedUser.username;
          updatedUser.address = returnedUser.address;
          updatedUser.phone = returnedUser.phone;
          updatedUser.roles = returnedUser.roles;
          res.json({ success: true, updatedUser: updatedUser, message: 'User has been successfully updated' });
        })
      }
    });
  }
}

module.exports.addCalendar = function(req, res) {
  console.log('in routeCtrl: ', req.body);
  if(req.body.year == undefined || req.body.year == '' || req.body.year == null) {
    res.json({ success: false, message: 'calendar information is incomplete!' });
  }else {
    let newYearSchedule = new YearSchedule();
    newYearSchedule.year = req.body.year;
    newYearSchedule.monthSchedules = req.body.monthSchedules;
    newYearSchedule.save((err, yearSchedule) => {
      if(err) {
        res.json({ success: false, message: 'this year of calendar has already been created' });
      }else if(yearSchedule) {
        res.json({ success: true, message: 'the new year of calendar has been created successfully' });
      }else {
        res.json({ success: false, message: 'something went wrong!' });
      }
    });
  }
};

module.exports.getCalendar = function(req, res) {
  if(req.params.currentYear == undefined || req.params.currentYear == '' || req.params.currentYear == null) {
    res.json({ success: false, message: 'calendar information is incomplete!' });
  }else if(isNaN(req.params.currentYear)) {
    res.json({ success: false, message: 'year needs to be a number' })
  }else {
    let yearSchedules = new Object();
    const currentYear = parseInt(req.params.currentYear, 10);
    YearSchedule.findOne({ year: currentYear }, (err, currentYearSchedule) => {
      if(err) {
        res.json({ success: false, message: err });
      }
      if(!currentYearSchedule) {
        res.json({ success: false, message: 'yearSchedule not found' });
      }else {
        yearSchedules.yearSchedules = [];
        yearSchedules.yearSchedules.push(currentYearSchedule);

        YearSchedule.findOne({year: currentYear + 1}, (err, nextYearSchedule) => {
          if(err) {
            res.json({ success: false, message: err });
          }
          if(!nextYearSchedule) {
            res.json({ success: false, message: 'yearSchedule not found' });
          }else {
            yearSchedules.yearSchedules.push(nextYearSchedule);
            // console.log('yearSchedules is: ', yearSchedules)
            res.json({ success: true, yearSchedules: yearSchedules })
          }
        });
      }
    });
  }
};

module.exports.addEvent = function(req, res) {
  if(req.body.newEvent == undefined || req.body.newEvent == null || req.body.year == undefined ||
     req.body.year == null || req.body.day == undefined || req.body.day == null ||
     req.body.month == undefined || req.body.month == null) {
    // console.log('im here 111');
    res.json({ success: false, message: 'please send the new event and id of daySchedule to add event!' });
  }else {
    // console.log('im here 222');
    //find the daySchedule
    YearSchedule.findOne({ year: req.body.year }, (err, yearSchedule) => {
      if(err) {
        res.json({ success: false, message: err });
      }
      if(!yearSchedule) {
        // console.log('yearSchedule is: ', yearSchedule);
        res.json({ success: false, message: 'yearSchedule not found' });
      }else {
        yearSchedule.addEvent(req.body.month, req.body.day, req.body.newEvent, (err, updatedYearSchedule) => {
          if(err) {
            res.json({ success: false, message: err });
          }
          if(!updatedYearSchedule) {
            res.json({ success: false, message: 'New event not saved due to some reason, please try again' });
          }
          // console.log('222 yearSchedule is: ', updatedYearSchedule);
          res.json({ success: true, updatedDaySchedule: updatedYearSchedule.monthSchedules[req.body.month].daySchedules[req.body.day] });
        });
      }
    })
    //call addEvent method to add
  }
}

module.exports.deleteEvent = function(req, res) {
  if(req.params.eventIndex == undefined || req.params.eventIndex == null || req.params.month == undefined ||
     req.params.month == null || req.params.day == undefined || req.params.day == null ||
     req.params.year == null || req.params.day == undefined) {
    console.log('req.params.eventIndex is: ', req.params.eventIndex);
    console.log('req.params.year is: ', req.params.year);
    console.log('req.params.month is: ', req.params.month);
    console.log('req.params.day is: ', req.params.day);
    res.json({ success: false, message: 'please send the event id, month, and day' });
  }else {
    YearSchedule.findOne({ year: req.params.year }, (err, yearSchedule) => {
      if(err) {
        res.json({ success: false, message: err });
      }
      if(!yearSchedule) {
        res.json({ success: false, message: 'yearSchedule not found' });
      }else {
        yearSchedule.deleteEvent(req.params.month, req.params.day, Number(req.params.eventIndex), (err, removedEvent) => {
          if(err) {
            res.json({ success: false, message: err });
          }
          if(!removedEvent) {
            res.json({ success: false, message: 'Event was not removed!' })
          }else {
            res.json({ success: true, message: 'Event was successfully deleted' });
          }
        })
      }
    });
  }
}
