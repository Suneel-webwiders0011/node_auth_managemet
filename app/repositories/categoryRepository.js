const BaseRepository = require('./BaseRepository');
const { Op } = require('sequelize');

class CategoryRepository extends BaseRepository{
    /**
     * Initializes the repository with a database connection.
     * @param {Object} db - Sequelize instance containing models.
     */
    constructor(db) {
        super();
        this.db = db;
    }

    /**
   * Retrieves a post by primary key (ID).
   * @param {number} id - Post ID.
   * @returns {Promise<Object|null>} Post instance or null if not found.
   */
  async getCategoryById(id) {
    return this.db.Category.findByPk(id);
  }

  async createCategory(data) {
    return this.db.Category.create(data);
  }

  async updateCategory(userId, category_id, data) {
    return this.db.Category.update(data, {
        where: {
            id: category_id,
            user_id: userId
        }
    });
  }

  /**
   * Fetches all Category from the database.
   * @returns {Promise<Array>} List of post instances.
   */
  async getAllCategory() {
    return await this.db.Category.findAll(); 
  }

  async deleteCategory(userId, categoryId) {
    return await this.db.Category.destroy({
        where: {
            id: categoryId,
            user_id: userId
        }
    });
  }


}

module.exports = CategoryRepository;