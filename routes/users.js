const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authController.authenticateJWT, authController.getAllUsers);
router.put('/update', authController.authenticateJWT, authController.updateUser);
router.post('/logout', authController.authenticateJWT, authController.logout);

router.get('/dashboard', authController.authenticateJWT, authController.dashboard);



module.exports = router;
