const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const mongoose = require("mongoose");

//server set-up
const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors());
app.use("/upload", uploadRoutes);

//db connection
const dbPORT = process.env.PORT || 3002;
mongoose
  .connect("mongodb://127.0.0.1:27017/PV", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    // Initialize your express app and routes here, after the connection is established
    app.listen(dbPORT, () => console.log(`App listening on port ${dbPORT}!`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
