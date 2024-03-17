const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const fs = require("fs");
const path = require("path");
const { processFiles } = require("../utils/fileProcessor");
const { buildTree } = require("../utils/HierarchyBuilder");
const AdmZip = require("adm-zip");
const { v4: uuidv4 } = require("uuid");
const TreeProject = require("../models/TreeModel"); // Adjust the path as necessary

router.post("/", upload.single("srcZip"), async (req, res) => {
  const { projectName, rootComponent } = req.body;
  console.log(
    "*********************************************************rootComponent",
    rootComponent
  );
  const uploadSessionId = uuidv4();
  const extractionDirectory = path.join(
    __dirname,
    "../../uploads",
    uploadSessionId
  );

  if (!fs.existsSync(extractionDirectory)) {
    fs.mkdirSync(extractionDirectory, { recursive: true });
  }

  let treeGeneratedSuccessfully = false;
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
    const rootComponentNameold = "index.js";
    const tree = buildTree(rootComponent, componentsWithImports);
    console.log("tree", tree);
    if (tree !== null && tree !== undefined) {
      const treeProject = new TreeProject({
        projectName,
        rootComponent,
        tree: tree,
      });
      await treeProject.save();
      treeGeneratedSuccessfully = true;
      res.json({ message: "Upload and processing completed", tree });
    } else {
      throw new Error("Failed to generate tree structure");
    }
  } catch (error) {
    console.error("Error handling upload from server:", error);
    res.status(500).send({ message: "Failed to extract and process files" });

    if (error.message === "Failed to generate tree structure") {
      res
        .status(500)
        .send({ alert: "Tree generation failed. Please try again." });
      treeGeneratedSuccessfully = true;
    }
  } finally {
    if (treeGeneratedSuccessfully) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(`Error deleting zip file: ${err}`);
        else console.log(`${req.file.path} was deleted`);
      });

      fs.rm(extractionDirectory, { recursive: true }, (err) => {
        if (err) console.error(`Error deleting extracted directory: ${err}`);
        else console.log(`${extractionDirectory} was deleted`);
      });
    }
  }
});

module.exports = router;
