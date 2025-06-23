const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // directory to save uploaded files
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 123456-image.png
//   }
// });

// // Optional: File filter (only allow images)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only image files are allowed"), false);
// };

// Set up dynamic storage with sanitized path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const inputPath = req.body.file_path || ''; // e.g., "custom/user_uploads"
    console.log('inputPath', inputPath);
    const safeSubPath = path.normalize(inputPath).replace(/^(\.\.[/\\])+/, ''); // prevents ../ injection
    const fullPath = path.join('uploads', safeSubPath); // final: uploads/custom/user_uploads

    // Create folder if doesn't exist
    fs.mkdir(fullPath, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, fullPath);
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // e.g., ".jpg"
    cb(null, uniqueSuffix + ext);
  }
});

// Only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
