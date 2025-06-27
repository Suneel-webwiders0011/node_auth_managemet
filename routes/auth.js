const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');
const userController = require('../app/controllers/userController');
const postController = require('../app/controllers/postController');

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

router.get('/admin-user-list', authController.authenticateJWT, userController.getAllUsers)
router.get('/admin-posts-list', authController.authenticateJWT, postController.getAllPosts)


module.exports = router;
