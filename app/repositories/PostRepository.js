const IPostRepository = require('./IPostRepository');
const { Op } = require('sequelize');

class PostRepository extends IPostRepository{
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
  async getPostById(id) {
    return this.db.Posts.findByPk(id);
  }

  /**
   * Finds a post by  user.
   * @param {string} slug - user id address to search.
   * @returns {Promise<Object|null>} Post instance or null.
   */
  async getPostsByUser(userId, limit, offset) {
    return this.db.Posts.findAndCountAll({
        where: { user_id: userId },
        order: [['createdAt', 'DESC']],
        limit,
        offset
    });
    // return this.db.Posts.findAll({ where: { user_id: userId } });
  }

  /**
   * Creates a new post with the provided data.
   * @param {Object} data - Post attributes to create.
   * @returns {Promise<Object>} Created user instance.
   */
  async createPost(data) {
    return this.db.Posts.create(data);
  }

  /**
   * Updates a post's information by ID.
   * @param {number} id - Posr ID.
   * @param {Object} data - Fields to update.
   * @returns {Promise<Array>} Update result (usually [affectedRows]).
   */
  async updatePosts(userId, postId, data) {
    return this.db.Posts.update(data, {
        where: {
            id: postId,
            user_id: userId //ensure user can only update their own post
        }
    });
  }

  /**
   * Fetches all posts from the database.
   * @returns {Promise<Array>} List of post instances.
   */
  async getAllPosts() {
    return await this.db.Posts.findAll(); 
  }

  async deletePosts(userId, postId) {
    return await this.db.Posts.destroy({
        where: {
            id: postId,
            user_id: userId // ensures user can only delete their own post
        }
    });
  }

  /**
   * Filters posts based on optional parameters: title, slug, and user_id.
   * Supports partial matches for title using LIKE.
   * @param {Object} filters - { title?: string, slug?: string, user_id?: int }
   * @returns {Promise<Array>} List of filtered posts.
   */
  async filterPost(filters) {
    const whereClause = {};
    if (filters.title) {
      whereClause.title = { [Op.like]: `%${filters.title}%` };
    }
    if (filters.slug) {
      whereClause.slug = filters.slug ;
    }

    return await this.db.Posts.findAll({ where: whereClause });
  }

  async getPostWithComments(postId) {
    return await this.db.Posts.findByPk(postId, {
      include: [
        {
          model: this.db.Comment,
          as: 'comments',
          include: [
            {
              model: this.db.User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
  }

  async createComment(commentData) {
    return await this.db.Comment.create(commentData);
  }


}

module.exports = PostRepository;