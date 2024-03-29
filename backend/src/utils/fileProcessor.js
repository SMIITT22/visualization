const fs = require("fs").promises;
const path = require("path");
const parser = require("@babel/parser");

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

/** readUploadedFiles(): it will act as this:

INPUT : /myDirectory
  /subDirectory1
    file1.txt
    file2.txt
  /subDirectory2
    file3.txt
  file4.txt

 OUTPUT : [
    '/myDirectory/subDirectory1/file1.txt',
    '/myDirectory/subDirectory1/file2.txt',
    '/myDirectory/subDirectory2/file3.txt',
    '/myDirectory/file4.txt'
  ]
*/

function extractImports(fileContent) {
  const ast = parser.parse(fileContent, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const imports = [];
  ast.program.body.forEach((node) => {
    if (node.type === "ImportDeclaration") {
      imports.push(node.source.value);
    }
  });
  return imports;
}
/**
   extractImports(): it will act as this:  
   INPUT: 
        import React from 'react';
        import { Button } from './components/Button';
        import type { SomeType } from './types';'

   OUTPUT:
         [
           'react',
           './components/Button',
           './types'
         ]
 */

async function processFiles(directory) {
  console.log(`Processing directory: ${directory}`);
  const filePaths = await readUploadedFiles(directory);
  const fileToImportsMap = {};
  for (const filePath of filePaths) {
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      const imports = extractImports(fileContent);
      const relativePath = path.relative(directory, filePath);
      console.log("relativePath", relativePath);
      fileToImportsMap[relativePath] = imports;
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  }

  console.log("Components with imports:", fileToImportsMap);
  return fileToImportsMap;
}

module.exports = { processFiles };
