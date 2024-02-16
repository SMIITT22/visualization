const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({
  dest: "uploads/",
});

app.post("/upload", upload.array("files[]"), (req, res) => {
  console.log(req.files);
  res.send("Files uploaded successfully");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
