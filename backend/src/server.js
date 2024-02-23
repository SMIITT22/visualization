const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

//here is the storing functionality.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../uploads/");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const newFilename = `${basename}${extension}`;
    console.log(newFilename);
    cb(null, newFilename);
  },
});

//here we are Filtering the src folder which is submitted by user.
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

const { processFiles } = require("./utils/fileProcessor");
const { buildTree } = require("./utils/HierarchyBuilder");

const { v4: uuidv4 } = require("uuid"); // Ensure you've installed uuid

app.post("/upload", upload.array("files[]"), async (req, res) => {
  const uploadSessionId = uuidv4();
  const directory = path.join(__dirname, "../uploads", uploadSessionId);

  try {
    // Ensure the subfolder exists
    fs.mkdirSync(directory, { recursive: true });

    // Move uploaded files into the subfolder
    req.files.forEach((file) => {
      // Construct the path where the file will be saved
      const savePath = path.join(directory, file.originalname);
      // Move the file from the temporary location to the save path
      fs.renameSync(file.path, savePath);
    });

    const componentsWithImports = await processFiles(directory);
    console.log("componentsWithImports", componentsWithImports);

    const rootComponentName = "index.js";
    const tree = buildTree(rootComponentName, componentsWithImports);

    // res.json({
    //   message: "Upload and processing completed",
    //   data: componentsWithImports,
    // });
    console.log("tree", tree);
    res.json({ message: "Upload and processing completed", tree });
  } catch (error) {
    console.error("Error handling upload from server:", error);
    res.status(500).send({ message: "Failed to handle upload from server" });
  }
});
