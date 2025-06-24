// /app/middleware/checkAuth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // This will be accessible in controllers: req.user.userId
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token' });
    }
};
