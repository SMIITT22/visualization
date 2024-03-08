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

  if (!fs.existsSync(extractionDirectory)) {
    fs.mkdirSync(extractionDirectory, { recursive: true });
  }

  try {
    const zip = new AdmZip(req.file.path);
    zip.extractAllTo(extractionDirectory, true);
    const srcDirectory = path.join(extractionDirectory, "src");
    if (!fs.existsSync(srcDirectory)) {
      console.error("No 'src' directory found within the uploaded zip.");
      return res.status(400).send({
        message: "Invalid zip structure. Expected a 'src' directory.",
      });
    }

    const componentsWithImports = await processFiles(srcDirectory);
    console.log("componentsWithImports", componentsWithImports);
    const rootComponentName = "index.js";
    const tree = buildTree(rootComponentName, componentsWithImports);
    console.log("tree", tree);

    res.json({ message: "Upload and processing completed", tree });
  } catch (error) {
    console.error("Error handling upload from server:", error);
    res.status(500).send({ message: "Failed to extract and process files" });
  }
});

module.exports = router;
