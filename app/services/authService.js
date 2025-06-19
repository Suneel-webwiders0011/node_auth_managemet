    // services/authService.js
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const UserRepository = require('../repositories/userRepository');

    class AuthService {
        constructor(userRepository) {
            this.userRepository = userRepository;
            this.jwtSecret = process.env.JWT_SECRET;
        }

        async login(email, password) {
            const user = await this.userRepository.findByUsername(email);
            if (!user || !await bcrypt.compare(password, user.password)) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, this.jwtSecret, { expiresIn: '1h' });
            return token;
        }

        verifyToken(token) {
            return jwt.verify(token, this.jwtSecret);
        }

        async register(name, password, email) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userId = await this.userRepository.createUser(name, hashedPassword, email);
            return userId;
        }

        async getAllUsers() {
            return await this.userRepository.getAllUsers();
        }

        async updateUser(userId, data) {
            return await this.userRepository.updateUser(userId, data);
        }
    }

    module.exports = AuthService;