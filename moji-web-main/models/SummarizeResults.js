const mongoose = require("mongoose");

const summarizeResultsSchema = mongoose.Schema(
  { comments: { type: mongoose.Schema.Types.Mixed, default: {} },
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    score: { type: Number, default: 0 },
    easy: {
      score: { type: Number, default: 0 },
      passage: { type: mongoose.Schema.Types.ObjectId, ref: 'Passage' },
      highlight: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    medium: {
      score: { type: Number, default: 0 },
      passage: { type: mongoose.Schema.Types.ObjectId, ref: 'Passage' },
      highlight: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    hard: {
      score: { type: Number, default: 0 },
      passage: { type: mongoose.Schema.Types.ObjectId, ref: 'Passage' },
      highlight: { type: mongoose.Schema.Types.Mixed, default: {} }
    }
  },
  { timestamps: true }
);



const summarizeResults = mongoose.model("summarizeResults", summarizeResultsSchema);

module.exports = summarizeResults;
