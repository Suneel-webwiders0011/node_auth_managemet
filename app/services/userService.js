const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET;
  }

  /**
   * Logs in a user by validating credentials and returns a JWT token.
   * @param {string} email - User's email.
   * @param {string} password - Plain text password.
   * @returns {string} JWT token valid for 1 hour.
   * @throws Will throw an error if credentials are invalid.
   */
  async login(email, password) {
    const user = await this.userRepository.findByOne(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    return jwt.sign({ userId: user.id, email: user.email }, this.jwtSecret, { expiresIn: '1h' });
  }


  /**
   * Verifies the provided JWT token and returns its decoded payload.
   * @param {string} token - JWT token to verify.
   * @returns {Object} Decoded token payload.
   */
  verifyToken(token) {
    return jwt.verify(token, this.jwtSecret);
  }

  /**
   * Registers a new user by hashing the password and saving user details.
   * @param {string} name - User's name.
   * @param {string} password - Plain text password.
   * @param {string} email - User's email.
   * @returns {Object} Created user object or ID depending on repository return.
   */
  async register(name,email,phone,user_type,password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRepository.createUser({
        name,
        email,
        phone,
        user_type,
        password: hashedPassword
        });
  }

  /**
   * Retrieves all users from the repository.
   * @returns {Array} List of users.
   */
  async getAllUsers(user_type) {
    return await this.userRepository.getAllUsers(user_type);
  }

  /**
   * Updates user details.
   * @param {number} userId - ID of the user to update.
   * @param {Object} data - Fields to update.
   * @returns {Object} Result of the update operation.
   */
  async updateUser(userId, data) {
    return await this.userRepository.updateUser(userId, data);
  }

  /**
   * Initiates password reset by generating a secure token and storing it.
   * @param {string} email - Email of the user requesting reset.
   * @returns {string} Generated reset token.
   * @throws Will throw an error if user not found.
   */
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

  /**
   * Resets the user's password using a valid token.
   * @param {string} token - Reset token.
   * @param {string} newPassword - New password to set.
   * @returns {boolean} True if reset successful.
   * @throws Will throw an error if token is invalid or expired.
   */
  async resetPassword(token, newPassword) {

    const user = await this.userRepository.findByResetToken(token);
    if (!user || new Date() > user.resetTokenExpiry) {
      throw new Error("Invalid or expired token");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePasswordAndClearReset(user.id, hashed);
    return true;

  }

  async filterUsers(filters) {
    return await this.userRepository.filterUsers(filters);
  }



}

module.exports = UserService;
