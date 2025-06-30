const express = require('express');

    //controllers/authController.js
    const ProductService = require('../services/productService');
    const ProductRepository = require('../repositories/productRepository');
    const db = require('../../database/db');

    const customResponse = require('../../helpers/response');
    const { now } = require('sequelize/lib/utils');

    const productRepository = new ProductRepository(db);
    const productService = new ProductService(productRepository);


    exports.createProduct = async (req, res) => {
        try {

            const { product_name,category_id,variant_id,price,discount,discount_type,description } = req.body;
           
            const userId = req.user?.userId;
            const status = 1;

            const productId = await productService.createProduct(userId, product_name,category_id,variant_id,price,discount,discount_type,description,status);
            return customResponse.success(res, { productId }, "Product added successfully", 201);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };


    exports.updateProduct = async (req, res) => {
        try {

            const userId = req.user.userId;
            const product_id = req.body.product_id;
            const token = req.token;
            const { name ,description, parent} = req.body;
            const data = {};
            if (name) data.name = name;
            if (description) data.description = description;
            if (parent) data.parent = parent;
            
            const product = await productService.updateProduct(userId, product_id, data);
            if (!product) {
                return customResponse.error(res, {},"You cannot update another user's product", 403);
            }

            return customResponse.success(res, { product }, "Product updated successfully", 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };

  
    exports.deleteProduct = async(req, res) => {
       try {

            const userId = req.user.userId;
            const productId = req.body.product_id;
            const product = await productService.deleteProduct(userId, productId);
            if (!product) {
                return customResponse.error(res, {},"You cannot delete another user's product", 403);
            }

            return customResponse.success(res, { product }, "Product deleted successfully", 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
    }


    exports.getAllProduct = async (req, res) => {
        try {
            const products = await productService.getAllProduct();
            return customResponse.success(res, { products });
        } catch (error) {
            return customResponse.error(res, error);
        }
    };
    
