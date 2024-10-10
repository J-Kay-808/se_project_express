const mongoose = require('mongoose');
const validator = require("validator");
const User = require("./user");

// Define weather enum
const weatherEnum = ['hot', 'warm', 'cold'];

// Clothing Item Schema
const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    weather: {
        type: String,
        required: true,
        enum: weatherEnum
    },
    imageUrl: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: 'Enter a valid URL',
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
            ref:"user",
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