    //controllers/authController.js
    const AuthService = require('../services/authService');
    const UserRepository = require('../repositories/userRepository');
    const db = require('../../database/db');

    const sendEmail = require('../../helpers/sendEmail');
    const customResponse = require('../../helpers/response');

    const userRepository = new UserRepository(db);
    const authService = new AuthService(userRepository);

    // const user = await userRepository.findById(1);
    // const userList = await userRepository.getAllUsers();

    exports.register = async (req, res) => {
        try {
            const { name, password, email } = req.body;
            const userId = await authService.register(name, password, email);
            // res.status(201).json({ success: true, userId });
            return customResponse.success(res, { userId }, "User registered successfully", 201);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    exports.login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const token = await authService.login(email, password);
            // res.json({ token });
            return customResponse.success(res, { token }, "User Loggedin successfully", 200);
        } catch (error) {
            // res.status(401).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    exports.getAllUsers = async (req, res) => {
        try {
            const users = await authService.getAllUsers();
            // res.json({ users });
            return customResponse.success(res, { users });
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    exports.updateUser = async (req, res) => {
        try {
            // console.log(req.body);
            const userId = req.user.userId;
            const token = req.token;
            const { phone } = req.body;
            const image = req.file ? req.file.filename : null;
            const data = {};
            if (phone) data.phone = phone;
            if (image) data.image = image;
            
            await authService.updateUser(userId, data);
            // res.json({ success: true })
            
            return customResponse.success(res, { token }, "profile updated successfully", 200);
        } catch (error) {
            // res.status(500).json({ message: error.message });
            return customResponse.error(res, error);
        }
    };

    exports.authenticateJWT = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {

            const token = authHeader.split(' ')[1];
            try {
                req.user = authService.verifyToken(token);
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

    // exports.logout = (req, res) => {
    //     res.status(200).json({ success: true, message: "Logged out successfully. Please delete your token on client side." });
    // };
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



    exports.dashboard = (req, res) => {
        res.json({
            success: true,
            message: "Welcome to your dashboard",
            user: req.user // Contains decoded JWT payload
        });
    };

    exports.forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const token = await authService.requestPasswordReset(email);
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

    exports.resetPassword = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            await authService.resetPassword(token, password);
            // res.json({ success: true, message: "Password reset successful." });
            return customResponse.success(res, {} ,"Password reset successful.", 200);
        } catch (err) {
            // res.status(400).json({ message: err.message });
            return customResponse.error(res, error);
        }
    };

