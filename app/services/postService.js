const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class PostService {
  constructor(postRepository) {
    this.postRepository = postRepository;
    this.jwtSecret = process.env.JWT_SECRET;
  }

  /**
   * Create a new post by user and saving details.
   * @param {string} title - post's title.
   * @param {string} image - binary file.
   * @param {string} description - text.
   * @param {string} user_id - integer.
   * @returns {Object} Created post object or ID depending on repository return.
   */
  async createPost(title, image, description, user_id, slug, status) {
    return await this.postRepository.createPost({
        title,
        image,
        description,
        user_id,
        slug,
        status
    });
  }

  /**
   * Retrieves all posts of users from the repository.
   * @returns {Array} List of posts.
   */
  async getPostsByUser(userId, limit, offset) {
    return await this.postRepository.getPostsByUser(userId, limit, offset);
  }

  /**
   * Updates user details.
   * @param {number} userId - ID of the user to update.
   * @param {Object} data - Fields to update.
   * @returns {Object} Result of the update operation.
   */
  async updatePosts(userId, postId, data) {
    const post = await this.postRepository.getPostById(postId);

    if (!post || post.user_id !== userId) {
        return false; // not found or not owned by user
    }
    return await this.postRepository.updatePosts(userId, postId, data);
  }


  async deletePosts(userId, postId) {
    const post = await this.postRepository.getPostById(postId);

    if (!post || post.user_id !== userId) {
        return false; // not found or not owned by user
    }

    return await this.postRepository.deletePosts(userId, postId);
  }

  async publishPosts(userId, postId, data) {
    const post = await this.postRepository.getPostById(postId);

    if (!post) {
        return false; // not found or not owned by user
    }

    return await this.postRepository.updatePosts(userId, postId, data);
  }


  async filterPost(filters) {
    return await this.postRepository.filterPost(filters);
  }

  async getPostWithComments(postId) {
    return await this.postRepository.getPostWithComments(postId);
  }

  async createComment(userId, postId, content) {
    const post = await this.postRepository.getPostById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    return await this.postRepository.createComment({
      content,
      post_id: postId,
      user_id: userId
    });
  }

  async getAllPosts() {
    return await this.postRepository.getAllPosts();
  }



}

module.exports = PostService;
