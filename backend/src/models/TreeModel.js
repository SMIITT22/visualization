const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema({
  projectName: String,
  rootComponent: String,
  tree: {
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
