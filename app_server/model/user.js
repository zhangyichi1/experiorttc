const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    reuqired: true,
    unique: true
  },
  username: {
    type: String,
    reuqired: true
  },
  password: {
    type: String,
    reuqired: true
  },
  role: {
    type: [String],
    required: true
  }
});

// userSchema.pre('save', function(next) {
//   let user = this;
//   console.log(user);
//   user.role.push('user');
//   bcrypt.hash(user.password, null, null, (err, hash) => {
//     if(err) {
//       return next(err);
//     }
//     // console.log(hash);
//     user.password = hash;
//     console.log(user.password);
//     next();
//   });
// });

const User = module.exports = mongoose.model('user', userSchema, 'users');

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByEmail = function(email, callback) {
  User.findOne({email: email}, callback);
};

module.exports.addUser = function(newUser, callback) {
  newUser.role.push('user');
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) {
        callback(true, null);
      }else {
        newUser.password = hash;
        console.log(newUser.password);
        newUser.save(callback);
      }
    });
  });
};

module.exports.comparePassword = function(password, hash, callback) {
  bcrypt.compare(password, hash, (err, valid) => {
    if(err) {
      callback(true, false);
    }else {
      callback(null, valid);
    }
  });
};
