const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "../../uploads");
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const newFilename = `${basename}${extension}`;
    cb(null, newFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (/\.(jsx|tsx|js|ts)$/.test(file.originalname)) {
    cb(null, true);
  } else {
    if (!req.rejectedFiles) {
      req.rejectedFiles = [];
    }
    req.rejectedFiles.push(file.originalname);
    cb(null, false);
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
