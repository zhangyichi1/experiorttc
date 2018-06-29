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
  roles: {
    type: [String],
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
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

userSchema.methods.update = function(body, callback) {
  this.email = body.email;
  this.username = body.username;
  this.address = body.address;
  this.phone = body.phone;
  this.save(callback);
}

const User = module.exports = mongoose.model('user', userSchema, 'users');

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByEmail = function(email, callback) {
  User.findOne({email: email}, callback);
};

module.exports.addUser = function(newUser, callback) {
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
