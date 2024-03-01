const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Adjust this path as necessary
const fs = require("fs");
const path = require("path");
const { processFiles } = require("../utils/fileProcessor");
const { buildTree } = require("../utils/HierarchyBuilder");
const { v4: uuidv4 } = require("uuid");

router.post("/", upload.array("files[]"), async (req, res) => {
  // Example validation checks for index.js and .js, .jsx, .ts, .tsx files
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

module.exports = router;
