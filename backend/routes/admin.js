const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Add question
router.post("/add", async (req, res) => {
  await Question.create(req.body);
  res.send("Question added");
});

// Get all questions
router.get("/all", async (req, res) => {
  const q = await Question.find();
  res.json(q);
});

module.exports = router;
