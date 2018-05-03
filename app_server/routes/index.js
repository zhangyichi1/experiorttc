const express = require('express');
const router = express.Router();
const routeCtrl = require('../controllers/routeCtrl');
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/signup', routeCtrl.signUp);

router.post('/signin', routeCtrl.signIn);

router.get('/profile', passport.authenticate('jwt', {session:false}), routeCtrl.authenticate);


module.exports = router;
