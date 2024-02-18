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
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const newFilename = `${basename}${extension}`;
    console.log(newFilename);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//processing of files functionality
const { processFiles } = require("./utils/fileProcessor");

app.post("/upload", upload.array("files[]"), async (req, res) => {
  const directory = path.join(__dirname, "../uploads"); // Adjust the path as necessary
  const componentsWithImports = await processFiles(directory);
  res.json({
    message: "Upload and processing completed",
    data: componentsWithImports,
  });
  console.log("componentsWithImports", componentsWithImports);
});
