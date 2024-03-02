const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); 
const fs = require("fs");
const path = require("path");
const { processFiles } = require("../utils/fileProcessor");
const { buildTree } = require("../utils/HierarchyBuilder");
const { v4: uuidv4 } = require("uuid");

router.post("/", upload.array("files[]"), async (req, res) => {
  const rootComponentName = req.body.rootComponentName || "index.js";

  // Validation checks for file types (post checking after multerConfig)
  const isValidFileTypes = req.files.every((file) =>
    /\.(jsx|tsx|js|ts)$/.test(file.originalname)
  );

  if (!isValidFileTypes) {
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
    return res.status(400).send({
      message: "Only .js, .jsx, .ts, or .tsx files are allowed.",
    });
  }

  // Creating a separate folder for each user submission
  const uploadSessionId = uuidv4();
  const directory = path.join(__dirname, "../../uploads", uploadSessionId);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Deduplicate and move files
  const uniqueFiles = new Map(
    req.files.map((file) => [file.originalname, file])
  );
  const moveFilePromises = Array.from(uniqueFiles.values()).map((file) => {
    return new Promise((resolve, reject) => {
      const savePath = path.join(directory, file.originalname);
      console.log(`Moving file from ${file.path} to ${savePath}`);
      fs.rename(file.path, savePath, (err) => {
        if (err) {
          console.error("Error moving file:", file.originalname, err);
          reject(err);
        } else {
          console.log(`Successfully moved ${file.originalname}`);
          resolve();
        }
      });
    });
  });

  try {
    await Promise.all(moveFilePromises);
    const componentsWithImports = await processFiles(directory);
    const tree = buildTree(rootComponentName, componentsWithImports);
    res.json({ message: "Upload and processing completed", tree });
  } catch (error) {
    console.error("Error handling upload from server:", error);
    res.status(500).send({ message: "Failed to handle upload from server" });
  }
});

module.exports = router;
