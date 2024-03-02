const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const fs = require("fs");
const path = require("path");
const { processFiles } = require("../utils/fileProcessor");
const { buildTree } = require("../utils/HierarchyBuilder");
const { v4: uuidv4 } = require("uuid");

router.post("/", upload.array("files[]"), async (req, res) => {
  /** validation checks after multer stores
   *  files(look it for multerConfig.js) and then we check here for index.js
   *  and .js, .jsx, .ts, .tsx files. **/
  const hasIndexJs = req.files.some((file) => file.originalname === "index.js");
  const isValidFileTypes = req.files.every((file) =>
    /\.(jsx|tsx|js|ts)$/.test(file.originalname)
  );

  if (!hasIndexJs || !isValidFileTypes) {
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });
    return res.status(400).send({
      message:
        "Upload must include index.js and only .js, .jsx, .ts, or .tsx files.",
    });
  }

  //making separate folder for each user submission
  const uploadSessionId = uuidv4();
  const directory = path.join(__dirname, "../../uploads", uploadSessionId);
  // Ensure the directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  // Move each file to the new directory asynchronously and handle errors
  const moveFilePromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const savePath = path.join(directory, file.originalname);
      fs.rename(file.path, savePath, (err) => {
        if (err) {
          console.error("Error moving file:", file.originalname, err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  try {
    // Wait for all files to be moved
    await Promise.all(moveFilePromises);
    // Process files after moving them (optional)
    const componentsWithImports = await processFiles(directory);
    console.log("componentsWithImports", componentsWithImports);
    const rootComponentName = "index.js";
    const tree = buildTree(rootComponentName, componentsWithImports);
    console.log("tree", tree);
    // Respond to the client
    res.json({ message: "Upload and processing completed", tree });
  } catch (error) {
    console.error("Error handling upload from server:", error);
    res.status(500).send({ message: "Failed to handle upload from server" });
  }
});

module.exports = router;
