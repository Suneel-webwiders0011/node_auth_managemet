const express = require('express');
const router = express.Router();
const validate = require('../app/middleware/validate');
const { saveValidation, postUpdateValidation } = require('../validators/postValidator');
const upload = require('../app/middleware/upload');
const postController = require('../app/controllers/postController');
const checkAuth = require('../app/middleware/checkAuth');

router
    .route('/')
    .get(checkAuth, postController.getPostsByUser)
    .post(checkAuth, upload.single('image'), saveValidation, validate, postController.savePosts)
    .put(checkAuth, upload.single('image'), postUpdateValidation, validate, postController.updatePosts)
    .delete(checkAuth, postController.deletePost);

router.get('/filter-post', checkAuth, postController.filterPosts);
router.post('/publish-post', checkAuth, postController.publishPosts);

router.get('/:id/comments', checkAuth, postController.getPostWithComments);
router.post('/comment', checkAuth, postController.createComment);

module.exports = router;    