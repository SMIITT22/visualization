const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema({
  name: String,
  children: [
    {
      // Define children as a nested schema to match the tree structure
      name: String,
      children: [
        {
          type: mongoose.Schema.Types.Mixed, // Allows for nested objects
        },
      ],
    },
  ],
});

const TreeNode = mongoose.model("TreeNode", treeSchema);
const TreeRoot = mongoose.model("TreeRoot", treeSchema);

module.exports = { TreeNode, TreeRoot };
