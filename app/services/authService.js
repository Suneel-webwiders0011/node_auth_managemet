const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    return jwt.sign({ userId: user.id, email: user.email }, this.jwtSecret, { expiresIn: '1h' });
  }

  verifyToken(token) {
    return jwt.verify(token, this.jwtSecret);
  }

  async register(name, password, email) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.createUser(name, hashedPassword, email);
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async updateUser(userId, data) {
    return await this.userRepository.updateUser(userId, data);
  }

  async requestPasswordReset(email) {

    const user = await this.userRepository.findByUsername(email);
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 hour

    await this.userRepository.saveResetToken(user.id, token, new Date(expiry));

    // In production, send via email:
    console.log(`Reset link: http://localhost:5000/users/reset-password/${token}`);
    // return true;
    return token; 

  }

  async resetPassword(token, newPassword) {

    const user = await this.userRepository.findByResetToken(token);
    if (!user || new Date() > user.resetTokenExpiry) {
      throw new Error("Invalid or expired token");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePasswordAndClearReset(user.id, hashed);
    return true;

  }


}

module.exports = AuthService;
