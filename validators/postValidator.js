const { body } = require('express-validator');

exports.saveValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),

    body('description')
        .notEmpty().withMessage('Description is required'),

];

exports.postUpdateValidation = [
    body('post_id')
        .notEmpty().withMessage('Post is required'),

    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),

    body('description')
        .notEmpty().withMessage('Description is required'),
];