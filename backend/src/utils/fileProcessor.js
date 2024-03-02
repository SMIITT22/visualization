const fs = require("fs").promises;
const path = require("path");
const parser = require("@babel/parser");

async function readUploadedFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    return files; // Ensure files is always an array
  } catch (error) {
    console.error("Error reading uploaded files:", error);
    return [];
  }
}

function extractImports(fileContent) {
  const ast = parser.parse(fileContent, {
    sourceType: "module",
    plugins: ["jsx", "classProperties"],
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
  const fileNames = await readUploadedFiles(directory);
  const fileToImportsMap = {};

  for (const fileName of fileNames) {
    const filePath = path.join(directory, fileName);
    console.log(`Processing file: ${filePath}`);
    const fileContent = await fs.readFile(filePath, "utf8");

    try {
      const imports = extractImports(fileContent);
      fileToImportsMap[fileName] = imports;
    } catch (error) {
      console.error(`Error processing file ${fileName}:`, error);
    }
  }
  return fileToImportsMap;
}

module.exports = { readUploadedFiles, extractImports, processFiles };
