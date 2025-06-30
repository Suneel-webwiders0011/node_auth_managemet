const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.jwtSecret = process.env.JWT_SECRET;
    }


    async createProduct(user_id, product_name,category_id,variant_id,price,discount,discount_type,description,status) {
        return await this.productRepository.createProduct({
           user_id, product_name,category_id,variant_id,price,discount,discount_type,description,status
        });
    }


    async updateProduct(userId, productId, data) {
        const product = await this.productRepository.getProductById(productId);

        if (!product || product.user_id !== userId) {
            return false; // not found or not owned by user
        }
        return await this.productRepository.updateProduct(userId, productId, data);
    }


    async deleteProduct(userId, productId) {
        const product = await this.productRepository.getPostById(productId);

        if (!product || product.user_id !== userId) {
            return false; // not found or not owned by user
        }

        return await this.productRepository.deleteProduct(userId, productId);
    }

    async getAllProduct() {
        return await this.productRepository.getAllProduct();
    }

}

module.exports = ProductService;
