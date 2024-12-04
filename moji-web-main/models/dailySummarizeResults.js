const mongoose = require("mongoose");

const dailySummarizeResultsSchema = new mongoose.Schema({
    comments: { type: mongoose.Schema.Types.Mixed, default: {} },
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    score: { type: Number, default: 0 },
    passage: { type: mongoose.Schema.Types.ObjectId, ref: 'Passage' },
    highlight: { type: mongoose.Schema.Types.Mixed, default: {} },
    dayNumber: {
        type: Number,
        required: true
    },
}, { timestamps: true });

const dailySummarizeResults = mongoose.model("dailySummarizeResults", dailySummarizeResultsSchema);

module.exports = dailySummarizeResults;