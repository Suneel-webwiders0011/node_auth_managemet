const express = require('express');

    //controllers/authController.js
    const PostService = require('../services/postService');
    const PostRepository = require('../repositories/PostRepository');
    const db = require('../../database/db');

    const customResponse = require('../../helpers/response');
    var slugify = require('slugify');
const { now } = require('sequelize/lib/utils');

    const postRepository = new PostRepository(db);
    const postService = new PostService(postRepository);

    /**
     * Create a new posts.
     * @route POST /posts
     * @param {Object} req.body - { title, image, description, user_id }
     * @param {Object} res
     * @returns {201} { success, data: { postId }, message }
     */
    exports.savePosts = async (req, res) => {
        try {
            console.log('request data', req.body);
            const { title, description } = req.body;
           
            const user_id = req.user?.userId;
            const slug = slugify(title, { lower: true, strict: true });

            const image = req.file ? req.file.filename : null;
            const status = 0;

            const postId = await postService.createPost(title, image, description, user_id, slug, status );
            // res.status(201).json({ success: true, userId });
            return customResponse.success(res, { postId }, "Post Created successfully", 201);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

   
    /**
     * Get list of all posts.
     * @route GET /posts
     * @param {Object} req (authenticated)
     * @param {Object} res
     * @returns {200} { success, data: { posts } }
     */
    exports.getPostsByUser = async (req, res) => {
        try {
            const userId = req.user.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10; // default: 10 posts per scroll
            const offset = (page - 1) * limit;

            const { count, rows: posts } = await postService.getPostsByUser(userId, limit, offset);
            // res.json({ users });
            return customResponse.success(res, {
                posts,
                page,
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    /**
     * Update profile of the authenticated user.
     * @route PUT /users
     * @param {Object} req.user - { userId }
     * @param {Object} req.body - optional { title, description }
     * @param {File} req.file - optional image upload
     * @param {Object} res
     * @returns {200} { success, data: { postId }, message }
     */
    exports.updatePosts = async (req, res) => {
        try {

            const userId = req.user.userId;
            const postId = req.body.post_id;
            const token = req.token;
            const { title } = req.body;
            const { description } = req.body;
            const image = req.file ? req.file.filename : null;
            const data = {};
            if (title) data.title = title;
            if (description) data.description = description;
            if (image) data.image = image;
            
            const posts = await postService.updatePosts(userId, postId, data);
            if (!posts) {
                return customResponse.error(res, {},"You cannot update another user's post", 403);
            }

            return customResponse.success(res, { posts }, "Post updated successfully", 200);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    /**
     * Delete post by user Id.
     * @route DELETE /post
     * @param {Object} req.session
     * @param {Object} res
    */
   exports.deletePost = async(req, res) => {
       try {

            const userId = req.user.userId;
            const postId = req.body.post_id;
            const posts = await postService.deletePosts(userId, postId);
            if (!posts) {
                return customResponse.error(res, {},"You cannot delete another user's post", 403);
            }

            return customResponse.success(res, { posts }, "Post deleted successfully", 200);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
   }

    exports.filterPosts = async (req, res) => {
        try {
            const { title, slug } = req.query;
            const users = await postService.filterPost({ title, slug });
            return customResponse.success(res, { users });
        } catch (error) {
            return customResponse.error(res, error);
        }
    };

    exports.publishPosts = async(req, res) =>{
        try {
            const userId = req.user.userId;
            const postId = req.body.post_id;
            const data = {};
            data.status = 1;
            data.published_date = now();
            
            const posts = await postService.publishPosts(userId, postId, data);
            if (!posts) {
                return customResponse.error(res, {},"You cannot publish another user's post", 403);
            }

            return customResponse.success(res, { posts }, "Post published successfully", 200);
        }catch(error){
            return customResponse.error(res, error);
        }
    }

    exports.getPostWithComments = async (req, res) => {
        try {
            const postId = req.params.id;
            const post = await postService.getPostWithComments(postId);
            return customResponse.success(res, { post });
        } catch (error) {
            return customResponse.error(res, error);
        }
    };

    exports.createComment = async (req, res) => {
        try {
            const userId = req.user.userId;
            const { post_id, content } = req.body;
            const comment = await postService.createComment(userId, post_id, content);
            return customResponse.success(res, { comment }, "Comment added successfully");
        } catch (error) {
            return customResponse.error(res, error);
        }
    };

    exports.getAllPosts = async (req, res) => {
        try {
            const posts = await postService.getAllPosts();
            return customResponse.success(res, { posts });
        } catch (error) {
            return customResponse.error(res, error);
        }
    };
    




