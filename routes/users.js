const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');

const { registerValidation , loginValidation, forgotPasswordValidation} = require('../validators/authValidator');
const validate = require('../app/middleware/validate');
const upload = require('../app/middleware/upload');


router.post('/register', registerValidation, validate, authController.register);

router.post('/login', loginValidation, validate, authController.login);

router.get('/', authController.authenticateJWT, authController.getAllUsers);

router.put('/update', authController.authenticateJWT, upload.single('image'), authController.updateUser);

router.post('/logout', authController.authenticateJWT, authController.logout);

router.get('/dashboard', authController.authenticateJWT, authController.dashboard);

router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


module.exports = router;
