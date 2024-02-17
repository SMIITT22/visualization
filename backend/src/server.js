const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const newFilename = `${basename}-${uniqueSuffix}${extension}`;
    cb(null, newFilename);
    console.log(`Mapping: ${file.originalname} -> ${newFilename}`);
  },
});

const upload = multer({ storage: storage });

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.post("/upload", upload.array("files[]"), (req, res) => {
  console.log(req.files);
  res.json({ message: "Files uploaded successfully" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
