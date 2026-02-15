const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  keywords: [String]
});

module.exports = mongoose.model("Question", questionSchema);
