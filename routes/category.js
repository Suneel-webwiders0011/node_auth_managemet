const express = require('express');
const router = express.Router();
const validate = require('../app/middleware/validate');
const upload = require('../app/middleware/upload');
const categoryController = require('../app/controllers/categoryController');
const checkAuth = require('../app/middleware/checkAuth');

router
    .route('/')
    .get(checkAuth, categoryController.getAllCategories)
    .post(checkAuth, categoryController.createCategory)
    .put(checkAuth, categoryController.updateCategory)
    .delete(checkAuth, categoryController.deleteCategory);

module.exports = router;    