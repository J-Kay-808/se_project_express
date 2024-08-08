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
});

// User Model
module.exports = mongoose.model('User', userSchema);