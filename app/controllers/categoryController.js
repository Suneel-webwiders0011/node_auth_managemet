const express = require('express');

    //controllers/authController.js
    const CategoryService = require('../services/categoryService');
    const CategoryRepository = require('../repositories/CategoryRepository');
    const db = require('../../database/db');

    const customResponse = require('../../helpers/response');
    const { now } = require('sequelize/lib/utils');

    const categoryRepository = new CategoryRepository(db);
    const categoryService = new CategoryService(categoryRepository);

    /**
     * Create a new category.
     * @route POST /category
     * @param {Object} req.body - { user_id, name, description, parent }
     * @param {Object} res
     * @returns {201} { success, data: { categoryId }, message }
     */
    exports.createCategory = async (req, res) => {
        try {

            const { name, description, parent } = req.body;
           
            const userId = req.user?.userId;
            const status = 0;

            const categoryId = await categoryService.createCategories(userId, name, description, parent, status);
            return customResponse.success(res, { categoryId }, "Category Created successfully", 201);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };


    exports.updateCategory = async (req, res) => {
        try {

            const userId = req.user.userId;
            const category_id = req.body.category_id;
            const token = req.token;
            const { name ,description, parent} = req.body;
            const data = {};
            if (name) data.name = name;
            if (description) data.description = description;
            if (parent) data.parent = parent;
            
            const category = await categoryService.updateCategory(userId, category_id, data);
            if (!category) {
                return customResponse.error(res, {},"You cannot update another user's category", 403);
            }

            return customResponse.success(res, { category }, "Category updated successfully", 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };

    /**
     * Delete category by Id.
     * @route DELETE /post
     * @param {Object} req.session
     * @param {Object} res
    */
   exports.deleteCategory = async(req, res) => {
       try {

            const userId = req.user.userId;
            const categoryId = req.body.category_id;
            const category = await categoryService.deleteCategory(userId, categoryId);
            if (!category) {
                return customResponse.error(res, {},"You cannot delete another user's category", 403);
            }

            return customResponse.success(res, { category }, "Category deleted successfully", 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
   }


    exports.getAllCategories = async (req, res) => {
        try {
            const categories = await categoryService.getAllCategories();
            return customResponse.success(res, { categories });
        } catch (error) {
            return customResponse.error(res, error);
        }
    };
    
