const ignorePatterns = [
  (importString) => importString.startsWith("react"),
  (importString) => importString.endsWith("material"),
  (importString) => importString.endsWith(".css"),
  (importString) => importString.includes("/styles/"),
  // Add more patterns here as needed.
];

const shouldIgnoreImport = (importString) => {
  return ignorePatterns.some((pattern) => pattern(importString));
};

module.exports = { shouldIgnoreImport };
