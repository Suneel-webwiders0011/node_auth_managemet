    //controllers/authController.js
    const UserService = require('../services/userService');
    const UserRepository = require('../repositories/UserRepository');
    const db = require('../../database/db');

    const sendEmail = require('../../helpers/sendEmail');
    const customResponse = require('../../helpers/response');

    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository);

    // const user = await authRepository.findById(1);
    // const userList = await authRepository.getAllUsers();

    /**
     * Register a new user.
     * @route POST /users
     * @param {Object} req.body - { name, email, phone, user_type, password }
     * @param {Object} res
     * @returns {201} { success, data: { userId }, message }
     */
    exports.register = async (req, res) => {
        try {
            const { name,email,phone,user_type,password } = req.body;
            const userId = await userService.register(name,email,phone,user_type,password);
            // res.status(201).json({ success: true, userId });
            return customResponse.success(res, { userId }, "User registered successfully", 201);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    /**
     * Authenticate a user and return a JWT.
     * @route POST /users/login
     * @param {Object} req.body - { email, password }
     * @param {Object} res
     * @returns {200} { success, data: { token }, message }
     */
    exports.login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const token = await userService.login(email, password);
            // res.json({ token });
            return customResponse.success(res, { token }, "User Loggedin successfully", 200);
        } catch (error) {
            // res.status(401).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    /**
     * Get list of all users.
     * @route GET /users
     * @param {Object} req (authenticated)
     * @param {Object} res
     * @returns {200} { success, data: { users } }
     */
    exports.getAllUsers = async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            // res.json({ users });
            return customResponse.success(res, { users });
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    /**
     * Update profile of the authenticated user.
     * @route PUT /users
     * @param {Object} req.user - { userId }
     * @param {Object} req.body - optional { name, phone }
     * @param {File} req.file - optional image upload
     * @param {Object} res
     * @returns {200} { success, data: { token }, message }
     */
    exports.updateUser = async (req, res) => {
        try {
            console.log(req.body);
            const userId = req.user.userId;
            const token = req.token;
            const { name } = req.body;
            const { phone } = req.body;
            const image = req.file ? req.file.filename : null;
            const data = {};
            if (name) data.name = name;
            if (phone) data.phone = phone;
            if (image) data.image = image;
            
            await userService.updateUser(userId, data);
            // res.json({ success: true })
            
            return customResponse.success(res, { token }, "profile updated successfully", 200);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };


    /**
     * Middleware to authenticate JWT token.
     * @param {Object} req.headers.authorization - "Bearer <token>"
     * @param {Object} res
     * @param {Function} next
     */
    exports.authenticateJWT = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {

            const token = authHeader.split(' ')[1];
            try {
                req.user = userService.verifyToken(token);
                req.token = token;
                next();
            } catch (error) {
                // res.status(403).json({ message: error.message });
                return customResponse.error(res, error);
            }
        } else {
            res.sendStatus(401);
        }
    };

    /**
     * Logout the authenticated user (destroy session/client token).
     * @route DELETE /users
     * @param {Object} req.session
     * @param {Object} res
    */
    exports.logout = (req, res) => {
        // Destroy express-session if used
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Logout failed' });
                }
            });
        }

        // Optional: blacklist the token (not implemented in this example)
        // tokenBlacklist.add(req.token)

        // Clear token on client — instruct client to delete it
        res.status(200).json({
            success: true,
            message: "Logged out successfully. Token invalidated (on client), session destroyed."
        });
    };


    /**
     * Show dashboard info for the authenticated user.
     * @route GET /users/dashboard
     * @param {Object} req.user
     * @param {Object} res
     * @returns {200} { success, message, user }
     */
    exports.dashboard = (req, res) => {
        res.json({
            success: true,
            message: "Welcome to your dashboard",
            user: req.user // Contains decoded JWT payload
        });
    };

    /**
     * Send password reset link to user’s email.
     * @route POST /users/forgot-password
     * @param {Object} req.body - { email }
     * @param {Object} res
     * @returns {200} { success, message }
     */
    exports.forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const token = await userService.requestPasswordReset(email);
            const resetLink = `http://localhost:5000/users/reset-password/${token}`;
            const html = `<p>Click the link below to reset your password:</p>
                        <a href="${resetLink}">${resetLink}</a>`;
            await sendEmail(email, 'Reset your password', html);

            // res.json({ success: true, message: "Reset link sent if email exists." });
            return customResponse.success(res, {} ,"Reset link sent if email exists", 200);
        } catch (err) {
            // res.status(500).json({ message: err.message });
            return customResponse.error(res, error);
        }
    };

    /**
     * Reset user password using the provided token.
     * @route POST /users/reset-password/:token
     * @param {Object} req.params - { token }
     * @param {Object} req.body - { password }
     * @param {Object} res
     * @returns {200} { success, message }
     */
    exports.resetPassword = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            await userService.resetPassword(token, password);
            // res.json({ success: true, message: "Password reset successful." });
            return customResponse.success(res, {} ,"Password reset successful.", 200);
        } catch (err) {
            // res.status(400).json({ message: err.message });
            return customResponse.error(res, error);
        }
    };

    /**
     * Filter users by optional query parameters.
     * @route GET /users/filter
     * @param {Object} req.query - optional { name, email, user_type }
     * @param {Object} res
     * @returns {200} { success, data: { users } }
     */
    exports.filterUsers = async (req, res) => {
        try {
            const { name, email, user_type } = req.query;
            const users = await userService.filterUsers({ name, email, user_type });
            return customResponse.success(res, { users });
        } catch (error) {
            return customResponse.error(res, error);
        }
    };



