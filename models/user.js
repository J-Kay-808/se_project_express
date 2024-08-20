const mongoose = require("mongoose");
const validator = require("validator");


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
            message: "You must enter a valid URL",
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
            message: 'You must enter a valid email',
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },

});


userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
    // trying to find the user by email
    return this.findOne({ email }) // this — the User model
        .select("+password")
        .then((user) => {
            // not found - rejecting the promise
            if (!user) {
                return Promise.reject(new Error(errorMessage.incorrectEmailOrPassword));
            }
            return bcrypt.compare(password, user.password).then((matched) => {
                if (!matched) {
                    return Promise.reject(new Error(errorMessage.incorrectEmailOrPassword));
                }
                return user;
            });
        });

};


// User Model
module.exports = mongoose.model('User', userSchema);