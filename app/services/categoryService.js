const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
    this.jwtSecret = process.env.JWT_SECRET;
  }

  async createCategories(user_id, name, description, parent, status) {
    return await this.categoryRepository.createCategory({
        user_id, name, description, parent, status
    });
  }


  /**
   * Updates user details.
   * @param {number} userId - ID of the user to update.
   * @param {Object} data - Fields to update.
   * @returns {Object} Result of the update operation.
   */
  async updateCategory(userId, category_id, data) {
    const category = await this.categoryRepository.getCategoryById(category_id);

    if (!category || category.user_id !== userId) {
        return false;
    }
    return await this.categoryRepository.updateCategory(userId, category_id, data);
  }


  async deleteCategory(userId, categoryId) {
    const category = await this.categoryRepository.getCategoryById(categoryId);

    if (!category || category.user_id !== userId) {
        return false; // not found or not owned by user
    }

    return await this.categoryRepository.deleteCategory(userId, categoryId);
  }


  async getAllCategories() {
    return await this.categoryRepository.getAllCategory();
  }



}

module.exports = CategoryService;
