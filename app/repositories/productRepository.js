const BaseRepository = require('./BaseRepository');
const { Op } = require('sequelize');

class ProductRepository extends BaseRepository {
    /**
     * Initializes the repository with a database connection.
     * @param {Object} db - Sequelize instance containing models.
     */
    constructor(db) {
        super();
        this.db = db;
    }


    async getProductById(id) {
        return this.db.Product.findByPk(id);
    }

    async createProduct(data) {
        return this.db.Product.create(data);
    }

    async updateProduct(userId, product_id, data) {
        return this.db.Product.update(data, {
            where: {
                id: product_id,
                user_id: userId
            }
        });
    }

   
    async getAllProduct() {
        return await this.db.Product.findAll();
    }

    async deleteProduct(userId, productId) {
        return await this.db.Product.destroy({
            where: {
                id: productId,
                user_id: userId
            }
        });
    }

}

module.exports = ProductRepository;