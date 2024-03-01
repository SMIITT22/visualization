const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes"); // Make sure this path matches your project structure

const app = express();
app.use(cors());

app.use("/upload", uploadRoutes); // Use the routes from uploadRoutes.js

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
