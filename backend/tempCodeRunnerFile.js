

app.use(cors());
app.use(express.json());

app.use("/api/interview", require("./routes/interview"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
