const fs = require("fs").promises;
const path = require("path");
const parser = require("@babel/parser");

// Utility function to create a node in the tree
function createNode(name) {
  return { name, children: [] };
}

// Resolves the full path of an import statement, including handling file extensions and index files in directories
function resolvePath(importPath, basePath, componentsWithImports) {
  // Normalize paths and handle file extensions
  let normalizedPath = importPath.replace(/^\.?\//, "");
  const possibleExtensions = [".js", ".jsx", "", "/index.js", "/index.jsx"];
  let resolvedPath = null;

  for (const extension of possibleExtensions) {
    const testPath = normalizedPath + extension;
    const fullPath = path.join(basePath, testPath);
    if (componentsWithImports[fullPath]) {
      resolvedPath = fullPath;
      break;
    }
  }

  return resolvedPath;
}

// Builds the dependency tree recursively, considering directories
function buildTree(
  rootName,
  componentsWithImports,
  visited = new Set(),
  basePath = "."
) {
  if (visited.has(rootName)) return null;
  visited.add(rootName);

  const nodeName = path.basename(rootName);
  const rootNode = createNode(nodeName);
  const dependencies = componentsWithImports[rootName] || [];

  dependencies.forEach((dep) => {
    const resolvedPath = resolvePath(dep, basePath, componentsWithImports);
    if (resolvedPath && !visited.has(resolvedPath)) {
      const childNode = buildTree(
        resolvedPath,
        componentsWithImports,
        visited,
        path.dirname(resolvedPath)
      );
      if (childNode) {
        rootNode.children.push(childNode);
      }
    } else if (!visited.has(dep)) {
      // Handle unresolved dependencies as leaf nodes
      rootNode.children.push(createNode(dep));
    }
  });

  return rootNode;
}

module.exports = { buildTree };
