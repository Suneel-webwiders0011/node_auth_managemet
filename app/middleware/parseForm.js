// parseForm.js
const multer = require('multer');
module.exports = multer().any(); // parses all fields first (including file_path)
