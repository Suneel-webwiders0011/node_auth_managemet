// middleware/extractPath.js
const Busboy = require('busboy');

const extractFilePath = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });
  let filePath = '';

  busboy.on('field', (fieldname, val) => {
    if (fieldname === 'file_path') {
      filePath = val;
      req.body.file_path = val; // attach to req.body
    }
  });

  busboy.on('finish', () => {
    req.file_path = filePath;
    next();
  });

  req.pipe(busboy);
};

module.exports = extractFilePath;
