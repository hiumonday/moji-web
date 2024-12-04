const mongoose = require('mongoose');

const PassageSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    notes: {
        type: String,
    },
    clientCreatedAt: {
        type: Date,
    },
}, { timestamps: true });

const NotesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // reference to the User model
        required: true,
    },
    passages: [PassageSchema],
});

const Notes = mongoose.model('Notes', NotesSchema);

module.exports = Notes;