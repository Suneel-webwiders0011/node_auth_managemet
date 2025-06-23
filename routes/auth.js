const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');

const { registerValidation , loginValidation, forgotPasswordValidation} = require('../validators/authValidator');
const validate = require('../app/middleware/validate');
const upload = require('../app/middleware/upload');
const parseForm = require('../app/middleware/parseForm');
const dynamicUploader = require('../app/middleware/uploadDynamic');
const extractFilePath = require('../app/middleware/extractPath');
const createMulterUpload = require('../app/middleware/uploadDynamic');


router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/', authController.authenticateJWT, authController.getAllUsers);
router.put('/update', authController.authenticateJWT, upload.single('image'), authController.updateUser);
router.post('/logout', authController.authenticateJWT, authController.logout);
router.get('/dashboard', authController.authenticateJWT, authController.dashboard);
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Step 1: Extract path from multipart request using Busboy
// router.put('/update', authController.authenticateJWT, extractFilePath, (req, res, next) => {
//   const pathFromClient = req.file_path || 'default';

//   // Step 2: Use multer with dynamic path
//   const upload = createMulterUpload(pathFromClient).single('image');
//   upload(req, res, function (err) {
//     if (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }
//     next();
//   });
// }, authController.updateUser);


module.exports = router;
