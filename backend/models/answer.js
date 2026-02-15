const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  skill: String,
  question: String,
  answer: String,
  score: Number,
  date: {type:Date, default:Date.now}
});

module.exports = mongoose.model("Answer", answerSchema);
