const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(cors());

app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
