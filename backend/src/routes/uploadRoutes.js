const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const fs = require("fs");
const path = require("path");
const { processFiles } = require("../utils/fileProcessor");
const { buildTree } = require("../utils/HierarchyBuilder");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");

router.post("/", upload.single("srcZip"), async (req, res) => {
  const uploadSessionId = uuidv4();
  const extractionDirectory = path.join(
    __dirname,
    "../../uploads",
    uploadSessionId
  );

  // Ensure the extraction directory exists
  if (!fs.existsSync(extractionDirectory)) {
    fs.mkdirSync(extractionDirectory, { recursive: true });
  }

  try {
    // Extract the zip file
    // Inside the POST handler
    const zip = new AdmZip(req.file.path);
    const uploadSessionId = uuidv4();
    const extractionDirectory = path.join(
      __dirname,
      "../../uploads",
      uploadSessionId,
      "src"
    );
    zip.extractAllTo(extractionDirectory, true);
    // Proceed with file processing and tree building here

    // Adjust the path to specifically target the src directory
    const srcDirectory = path.join(extractionDirectory, "src");

    // After extraction, process the files within the src directory
    const componentsWithImports = await processFiles(srcDirectory);
    console.log("componentsWithImports", componentsWithImports);
    const rootComponentName = "index.js"; // Adjust if necessary to match your root component file
    const tree = buildTree(rootComponentName, componentsWithImports);
    console.log("tree", tree);

    res.json({ message: "Upload and processing completed", tree });
  } catch (error) {
    console.error("Error handling upload from server:", error);
    res.status(500).send({ message: "Failed to extract and process files" });
  }
});

module.exports = router;
