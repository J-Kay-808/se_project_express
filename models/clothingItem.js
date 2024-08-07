const mongoose = require('mongoose');
const User = require("./user");
const validator = require("validator");

// Define weather enum
const weatherEnum = ['hot', 'warm', 'cold'];

// Clothing Item Schema
const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        minlength: 2,
        maxlength: 30
    },
    weather: {
        type: String,
        // required: true,
        enum: weatherEnum
    },
    imageUrl: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isURL(value),
            message: "You must enter a valid URL",
        },
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],

    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Clothing Item Model
const ClothingItem = mongoose.model('ClothingItem', clothingItemSchema);

module.exports = ClothingItem;