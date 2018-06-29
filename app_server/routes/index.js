const express = require('express');
const router = express.Router();
const routeCtrl = require('../controllers/routeCtrl');
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/signup', routeCtrl.signUp);

router.post('/signin', routeCtrl.signIn);

router.post('/calendar', routeCtrl.addCalendar);

router.post('/event', routeCtrl.addEvent);

router.get('/calendar/:currentYear', routeCtrl.getCalendar);

// router.get('/profile', passport.authenticate('jwt', {session:false}), routeCtrl.authenticate);
router.get('/user/:email', routeCtrl.getUser);

router.get('/users', routeCtrl.getUsers);

router.put('/user', routeCtrl.updateUser);

router.delete('/event/:year/:month/:day/:eventIndex', routeCtrl.deleteEvent);


module.exports = router;
