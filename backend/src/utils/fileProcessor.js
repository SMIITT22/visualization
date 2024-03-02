const fs = require("fs").promises;
const path = require("path");
const parser = require("@babel/parser");

// Updated to handle recursive directory processing
async function readUploadedFiles(directory, fileList = []) {
  const dirents = await fs.readdir(directory, { withFileTypes: true });
  for (const dirent of dirents) {
    const resPath = path.resolve(directory, dirent.name);
    if (dirent.isDirectory()) {
      await readUploadedFiles(resPath, fileList);
    } else {
      fileList.push(resPath);
    }
  }
  return fileList;
}

function extractImports(fileContent) {
  const ast = parser.parse(fileContent, {
    sourceType: "module",
    plugins: ["jsx", "typescript"], // Adjust as needed
  });

  const imports = [];
  ast.program.body.forEach((node) => {
    if (node.type === "ImportDeclaration") {
      imports.push(node.source.value);
    }
  });
  return imports;
}

async function processFiles(directory) {
  console.log(`Processing directory: ${directory}`);
  const filePaths = await readUploadedFiles(directory);
  console.log(`Found files: ${filePaths.join(", ")}`);

  const fileToImportsMap = {};

  for (const filePath of filePaths) {
    console.log(`Reading file: ${filePath}`);
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      console.log(`File content: ${fileContent.slice(0, 100)}...`); // Log the first 100 characters
      const imports = extractImports(fileContent);
      console.log(`Imports found: ${imports.join(", ")}`);
      // Store imports using relative paths for easier reference
      const relativePath = path.relative(directory, filePath);
      fileToImportsMap[relativePath] = imports;
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  console.log("Components with imports:", fileToImportsMap);
  return fileToImportsMap;
}

module.exports = { processFiles };
