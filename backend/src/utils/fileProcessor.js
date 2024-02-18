const fs = require("fs").promises;
const path = require("path");
const parser = require("@babel/parser");

async function readUploadedFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    const fileContents = await Promise.all(
      files.map((file) => {
        const filePath = path.join(directory, file);
        return fs.readFile(filePath, "utf8");
      })
    );
    return fileContents;
  } catch (error) {
    console.error("Error reading uploaded files:", error);
  }
}

function extractImports(fileContent) {
  const ast = parser.parse(fileContent, {
    sourceType: "module", // Treat the file as an ES module
    plugins: [
      "jsx", // Enable JSX parsing
      "js", // Add other plugins if needed, e.g., 'typescript' for TS files
    ],
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
  const fileContents = await readUploadedFiles(directory);
  const relationships = fileContents.map((content) => extractImports(content));
  return relationships;
}

module.exports = { readUploadedFiles, extractImports, processFiles };
