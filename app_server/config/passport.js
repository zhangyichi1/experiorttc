const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/user');
const config = require('./database');
const FirebaseStrategy = require('passport-firebase-auth').strategy;


module.exports.jwtStrategy = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('jwt_payload is: ', jwt_payload);
    User.getUserById(jwt_payload._id, (err, user) => {
      if(err) {
        return done(err, false);
      }else if(user) {
        return done(null, user);
      }else {
        return done(null, false);
      }
    });
  }));
};

// module.exports.googleStrategy = function(passport) {
//   passport.use(new FirebaseStrategy({
//       firebaseProjectId: config.firebaseProjectId,
//       authorizationURL: 'https://account.example.net/auth'
//     },
//     function(accessToken, refreshToken, decodedToken, cb) {
//       // User.findOrCreate(..., function (err, user) {
//       //   return cb(err, user);
//       // });
//     }
//   ));
// };
