const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { errorMessage } = require('../utils/errors');


// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    avatar: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "Enter a valid URL",
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator(value) {
                return validator.isEmail(value);
            },
            message: 'Enter a valid email',
        }
    },
    password: {
        type: String,
        required: true,
        select: false,
    },

});

userSchema.statics.findUserByCredentials = function findUserbyCredentials(
    email,
    password
  ) {
    return this.findOne({ email })
      .select("+password")
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error(errorMessage.incorrectEmailOrPassword));        }
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(errorMessage.incorrectEmailOrPassword));          }
          return user;
        });
      });
  };


// User Model
module.exports = mongoose.model('user', userSchema);