const express = require('express');
const router = express.Router();
const routeCtrl = require('../controllers/routeCtrl');
// const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/signup', routeCtrl.signUp);

router.post('/signin', routeCtrl.signIn);

router.post('/calendar', routeCtrl.addCalendar);

router.post('/event', passport.authenticate('user', {session:false}), routeCtrl.addEvent);

router.get('/calendar/:currentYear', routeCtrl.getCalendar);

router.get('/user/:email', routeCtrl.getUser);

// router.get('/users', passport.authenticate('jwt', {session:false}), routeCtrl.getUsers);
router.get('/users', passport.authenticate('admin', {session:false}), routeCtrl.getUsers);

router.put('/user', passport.authenticate('admin', {session:false}), routeCtrl.updateUser);

router.delete('/user/:email', passport.authenticate('admin', {session:false}), routeCtrl.deleteUser);

router.delete('/event/:year/:month/:day/:eventIndex', passport.authenticate('user', {session:false}), routeCtrl.deleteEvent);

module.exports = router;
