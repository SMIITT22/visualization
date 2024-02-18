function createNode(name) {
  return { name, children: [] };
}
function buildTree(rootName, componentsWithImports, visited = new Set()) {
  const rootNode = createNode(rootName);
  visited.add(rootName); // Mark the current node as visited

  const dependencies = componentsWithImports[rootName] || [];

  dependencies.forEach((dep) => {
    // Adjusted logic to keep file extensions
    let depName = dep.split("/").pop(); // Keep the file name with extension

    // If the dependency is a local file (starts with './'), try to match it against the keys in componentsWithImports
    if (dep.startsWith("./")) {
      // Construct the expected key by appending the directory and extension if not present
      const possibleExtensions = [".js", ".jsx"]; // Add more if you have other types of files
      let found = false;

      possibleExtensions.forEach((ext) => {
        if (!found) {
          const testKey = depName.endsWith(ext) ? depName : `${depName}${ext}`;
          if (componentsWithImports.hasOwnProperty(testKey)) {
            depName = testKey; // Use the full name including extension
            found = true;
          }
        }
      });
    }

    // Only proceed if the dependency was found in the mapping
    if (
      componentsWithImports.hasOwnProperty(depName) &&
      !visited.has(depName)
    ) {
      const childNode = buildTree(depName, componentsWithImports, visited);
      rootNode.children.push(childNode);
    } else if (!visited.has(depName)) {
      // Handle external libraries or missing components differently, if necessary
      rootNode.children.push(createNode(depName)); // Add as a leaf node without further exploration
    }
  });

  return rootNode;
}
module.exports = { buildTree };
