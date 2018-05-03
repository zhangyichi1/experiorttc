const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../model/user');
const config = require('../config/database');
const util = require('../controllers/util');

module.exports.signUp = function(req, res) {
  // console.log('here is the req, ', req);
  console.log(req.body);
  if(req.body.email == undefined || req.body.email == null || req.body.email == '' || req.body.username == undefined || req.body.username == null || req.body.username == ''
  || req.body.password == undefined || req.body.password == null || req.body.password == '') {
    res.json({ success: false, message: 'User information is not complete' });
  }else if(!util.validateEmail(req.body.email)) {
    res.json({ success: false, message: 'The email entered is invalid' })
  }else {
    let newUser = new User();
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = req.body.password;
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
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
          }
        });
      }else {
        res.json({ success: false, message: 'Registration failed' });
      }
    })
  }
};

module.exports.signIn = function(req, res) {
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
        throw err;
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
            const token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: '1h'
            });
            res.json({
              success: true,
              token: 'Bearer ' + token,
              user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
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

module.exports.authenticate = function(req, res) {
  // res.json({ user: req.user });
  res.json({ user: {
    email: 'temp@temp.com',
    username: 'temp'
  }});
}
