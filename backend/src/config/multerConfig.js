// multerConfig.js adjustments
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "../../uploads");
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .zip files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;

/**
 *  we are basically filtering the files here in multerConfig.js  using the
 *  fileFilter function.This happens at the moment the files are being uploaded.
 *  If a file does not match the specified extensions, it's rejected by multer
 *  and not processed further.
 * **/
