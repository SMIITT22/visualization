const express = require("express");
const multer = require("multer");
const cors = require("cors");
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
  },
});

const fileFilter = (req, file, cb) => {
  if (/\.(jsx|tsx|js|ts)$/.test(file.originalname)) {
    cb(null, true);
  } else {
    if (!req.rejectedFiles) {
      req.rejectedFiles = [];
    }
    req.rejectedFiles.push(file.originalname);
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.post("/upload", upload.array("files[]"), (req, res) => {
  const acceptedFiles = req.files.map((file) => file.originalname);
  const rejectedFiles = req.rejectedFiles || [];

  if (acceptedFiles.length === 0 && rejectedFiles.length > 0) {
    return res.status(400).json({
      message: "No valid files were uploaded.",
      rejectedFiles: rejectedFiles,
    });
  }

  res.json({
    message: "Upload process completed",
    acceptedFiles: acceptedFiles,
    rejectedFiles: rejectedFiles,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
