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

const { v4: uuidv4 } = require("uuid");

app.post("/upload", upload.array("files[]"), async (req, res) => {
  const hasIndexJs = req.files.some((file) => file.originalname === "index.js");
  const isValidFileTypes = req.files.every((file) =>
    /\.(jsx|tsx|js|ts)$/.test(file.originalname)
  );

  if (!hasIndexJs || !isValidFileTypes) {
    // Delete the temporarily saved files
    req.files.forEach((file) => {
      fs.unlinkSync(file.path); // Assuming 'file.path' points to the temp location
    });
    return res.status(400).send({
      message:
        "Upload must include index.js and only .js, .jsx, .ts, or .tsx files.",
    });
  }

  const uploadSessionId = uuidv4();
  const directory = path.join(__dirname, "../uploads", uploadSessionId);
  try {
    fs.mkdirSync(directory, { recursive: true });
    req.files.forEach((file) => {
      const savePath = path.join(directory, file.originalname);
      fs.renameSync(file.path, savePath);
    });

    const componentsWithImports = await processFiles(directory);
    console.log("componentsWithImports", componentsWithImports);
    const rootComponentName = "index.js";
    const tree = buildTree(rootComponentName, componentsWithImports);
    console.log("tree", tree);
    res.json({ message: "Upload and processing completed", tree });
  } catch (error) {
    console.error("Error handling upload from server:", error);
    res.status(500).send({ message: "Failed to handle upload from server" });
  }
});
