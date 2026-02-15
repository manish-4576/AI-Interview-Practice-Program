const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Interview Practice API is running 🚀");
});

// Routes
app.use("/api/interview", interviewRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
