const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer({
  dest: "uploads/",
});
const corsOptions = {
  origin: "http://localhost:3000", // Allow only your frontend origin
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions)); // Use CORS with options
app.post("/upload", upload.array("files[]"), (req, res) => {
  console.log(req.files);
  res.json({ message: "Files uploaded successfully" }); // Send a JSON response
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
