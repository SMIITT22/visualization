const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema({
  projectName: String, // New field for project name
  rootComponent: String, // New field for root component name
  tree: {
    // Assuming the existing tree structure is encapsulated in a 'tree' field
    name: String,
    children: [
      {
        name: String,
        children: [
          {
            type: mongoose.Schema.Types.Mixed, // Allows for nested objects
          },
        ],
      },
    ],
  },
});

const TreeProject = mongoose.model("TreeProject", treeSchema);

module.exports = TreeProject;
