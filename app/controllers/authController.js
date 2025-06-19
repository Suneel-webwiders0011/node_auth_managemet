    //controllers/authController.js
    const AuthService = require('../services/authService');
    const UserRepository = require('../repositories/userRepository');
    const db = require('../../database/db');

    const userRepository = new UserRepository(db);
    const authService = new AuthService(userRepository);

    exports.register = async (req, res) => {
        try {
            const { name, password, email } = req.body;
            const userId = await authService.register(name, password, email);
            res.status(201).json({ success: true, userId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    exports.login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const token = await authService.login(email, password);
            res.json({ token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    };

    exports.getAllUsers = async (req, res) => {
        try {
            const users = await authService.getAllUsers();
            res.json({ users });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    exports.updateUser = async (req, res) => {
        try {
            const userId = req.user.userId;
            const updated = await authService.updateUser(userId, req.body);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ message: error.message });
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
                res.status(403).json({ message: error.message });
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
