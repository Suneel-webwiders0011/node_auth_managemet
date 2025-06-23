// middleware/uploadDynamic.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const createMulterUpload = (uploadPath) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const safePath = path.normalize(uploadPath).replace(/^(\.\.[\/\\])+/, '');
      const fullPath = path.join('uploads', safePath);
      fs.mkdir(fullPath, { recursive: true }, (err) => {
        cb(err, fullPath);
      });
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  };

  return multer({ storage, fileFilter });
};

module.exports = createMulterUpload;
