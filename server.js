const express = require('express');
const path = require('path');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
// const user = require('./app_server/model/user');
const config = require('./app_server/config/database');
const routes = require('./app_server/routes/index');
const server = express();

server.use(favicon(__dirname + '/client/src/assets/img/logo.jpg'));
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
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

//set static folder
server.use(express.static(path.join(__dirname, 'public')));

//set up passport
server.use(passport.initialize());
server.use(passport.session());
require('./app_server/config/passport').jwtStrategy(passport);

//set up api routes
server.use('/api', routes);

//index route
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'));
});

module.exports = server;
