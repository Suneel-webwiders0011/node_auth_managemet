const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const { registerValidation, loginValidation, forgotPasswordValidation } = require('../validators/authValidator');
const validate = require('../app/middleware/validate');
const upload = require('../app/middleware/upload');

// Grouped route for "/users"
router
  .route('/')
  .get(userController.authenticateJWT, userController.getAllUsers)         // GET /users
  .post(registerValidation, validate, userController.register)             // POST /users
  .put(userController.authenticateJWT, upload.single('image'), userController.updateUser) // PUT /users
  .delete(userController.authenticateJWT, userController.logout);          // DELETE /users

// Auth-specific routes
router.post('/login', loginValidation, validate, userController.login);
router.get('/dashboard', userController.authenticateJWT, userController.dashboard);
router.post('/forgot-password', forgotPasswordValidation, validate, userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/filter', userController.authenticateJWT, userController.filterUsers);

module.exports = router;
