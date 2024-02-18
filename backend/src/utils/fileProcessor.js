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
    plugins: ["jsx", "js"],
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
    const fileContent = await fs.readFile(filePath, "utf8");
    const imports = extractImports(fileContent);
    fileToImportsMap[fileName] = imports;
  }

  return fileToImportsMap;
}

module.exports = { readUploadedFiles, extractImports, processFiles };
