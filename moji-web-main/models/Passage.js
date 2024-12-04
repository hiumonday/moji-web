const mongoose = require('mongoose');

const PassageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    summary: {
        type: String
    },
    dayNumber: {
        type: Number,
        required: true
    },
    note:{
        type: String
    }
});

module.exports = mongoose.model('Passage', PassageSchema);