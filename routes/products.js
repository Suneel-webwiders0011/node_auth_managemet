const express = require('express');
const router = express.Router();
const validate = require('../app/middleware/validate');
const upload = require('../app/middleware/upload');
const productController = require('../app/controllers/productController');
const checkAuth = require('../app/middleware/checkAuth');

router
    .route('/')
    .get(checkAuth, productController.getAllProduct)
    .post(checkAuth, productController.createProduct)
    .put(checkAuth, productController.updateProduct)
    .delete(checkAuth, productController.deleteProduct);

module.exports = router;    