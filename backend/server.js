const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/interview", interviewRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/interviewDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
