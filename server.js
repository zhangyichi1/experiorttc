const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const admin = require('firebase-admin');

const user = require('./app_server/model/user');
const config = require('./app_server/config/database');
const serviceAccount = require('./app_server/config/privateKey.json');

const routes = require('./app_server/routes/index');

const server = express();

// server.set('views', path.join(__dirname, 'app_server/views'));
// server.engine('html', require('ejs').renderFile);
// server.set('view engine', 'html');
// server.set('view engine', 'jade');

server.use(favicon(__dirname + '/client/src/assets/img/experior-icon-rectangle.jpg'));
server.use(morgan('dev'));
// console.log('config: ', config.database);
mongoose.connect(config.database, (err) => {
  if(err) {
    console.log('not connected to db', err);
  }else {
    console.log('successfully connected to db: ', config.database);
  }
});

//set up CORS
server.use(cors());

//set up bodyParser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

//set static folder
server.use(express.static(path.join(__dirname, 'public')));

//set up passport
// server.use(passport.initialize());
// server.use(passport.session());
//
// require('./app_server/config/passport').jwtStrategy(passport);
//
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: config.firebaseDBUrl
// });

//set up api routes
server.use('/api', routes);

//index route
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'));
});

// server.use((req, res, err) => {
//   let err = new Error('Not found');
//   err.status = 404;
//   next(err);
// });
//
// if(server.get('env') === 'development') {
//   server.use((err, req, res, next) => {
//     console.log('hahaha');
//     res.status(err.status || 500);
//     res.sendFile(path.join(__dirname + '/public/client/error.html'));
//   });
// }
//
// server.use((err, req, res, next) => {
//   console.log('1111');
//   res.status(err.status || 500);
//   res.render(path.join(__dirname + '/public/client/error.html'));
// });

module.exports = server;
