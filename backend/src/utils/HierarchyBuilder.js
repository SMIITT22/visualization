function createNode(name) {
  return { name, children: [] };
}
function buildTree(rootName, componentsWithImports, visited = new Set()) {
  const rootNode = createNode(rootName);
  visited.add(rootName);

  const dependencies = componentsWithImports[rootName] || [];

  dependencies.forEach((dep) => {
    let depName = dep.split("/").pop();

    if (dep.startsWith("./")) {
      const possibleExtensions = [".js", ".jsx"];
      let found = false;

      possibleExtensions.forEach((ext) => {
        if (!found) {
          const testKey = depName.endsWith(ext) ? depName : `${depName}${ext}`;
          if (componentsWithImports.hasOwnProperty(testKey)) {
            depName = testKey;
            found = true;
          }
        }
      });
    }

    if (
      componentsWithImports.hasOwnProperty(depName) &&
      !visited.has(depName)
    ) {
      const childNode = buildTree(depName, componentsWithImports, visited);
      rootNode.children.push(childNode);
    } else if (!visited.has(depName)) {
      rootNode.children.push(createNode(depName));
    }
  });

  return rootNode;
}
module.exports = { buildTree };
