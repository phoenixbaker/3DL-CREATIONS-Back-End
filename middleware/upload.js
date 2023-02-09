const multer = require("multer");
const multerFS = require("multer-gridfs-storage");

const storage = new multerFS.GridFsStorage({
  url: process.env.URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: file.fieldname,
      filename: file.originalname,
    };
  },
});

module.exports = multer({ storage });
