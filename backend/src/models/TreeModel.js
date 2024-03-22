const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema(
  {
    projectName: String,
    rootComponent: String,
    tree: {
      name: String,
      children: [
        {
          name: String,
          children: [
            {
              type: mongoose.Schema.Types.Mixed, // Allows nested objects
            },
          ],
        },
      ],
    },
  },
  { timestamps: true }
);

const TreeProject = mongoose.model("TreeProject", treeSchema);

module.exports = TreeProject;
