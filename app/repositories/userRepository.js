// repositories/UserRepository.js
const IUserRepository = require('./IUserRepository');
const { Op } = require('sequelize');

class UserRepository extends IUserRepository {
  /**
   * Initializes the repository with a database connection.
   * @param {Object} db - Sequelize instance containing models.
   */
  constructor(db) {
    super();
    this.db = db;
  }

  /**
   * Retrieves a user by primary key (ID).
   * @param {number} id - User ID.
   * @returns {Promise<Object|null>} User instance or null if not found.
   */
  async getUserById(id) {
    return this.db.User.findByPk(id);
  }

  /**
   * Finds a user by email.
   * @param {string} email - Email address to search.
   * @returns {Promise<Object|null>} User instance or null.
   */
  async findByOne(email) {
    return this.db.User.findOne({ where: { email } });
  }

  /**
   * Creates a new user with the provided data.
   * @param {Object} data - User attributes to create.
   * @returns {Promise<Object>} Created user instance.
   */
  async createUser(data) {
    return this.db.User.create(data);
  }

  /**
   * Updates a user's information by ID.
   * @param {number} id - User ID.
   * @param {Object} data - Fields to update.
   * @returns {Promise<Array>} Update result (usually [affectedRows]).
   */
  async updateUser(id, data) {
    return this.db.User.update(data, { where: { id } });
  }

  /**
   * Fetches all users from the database.
   * @returns {Promise<Array>} List of user instances.
   */
  async getAllUsers(user_type) {
    return await this.db.User.findAll({ where: {'user_type': user_type} }); 
  }

  /**
   * Filters users based on optional parameters: name, email, and user_type.
   * Supports partial matches for name and email using LIKE.
   * @param {Object} filters - { name?: string, email?: string, user_type?: string }
   * @returns {Promise<Array>} List of filtered users.
   */
  async filterUsers(filters) {
    const whereClause = {};
    if (filters.name) {
      whereClause.name = { [Op.like]: `%${filters.name}%` };
    }
    if (filters.email) {
      whereClause.email = { [Op.like]: `%${filters.email}%` };
    }
    if (filters.user_type) {
      whereClause.user_type = filters.user_type;
    }
    return await this.db.User.findAll({ where: whereClause });
  }
}

module.exports = UserRepository;
