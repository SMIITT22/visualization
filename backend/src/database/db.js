const mongoose = require("mongoose");

// MongoDB connection string
const mongoURI = "mongodb://127.0.0.1:27017/PV";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("We're connected to the database.");
});
