const BaseRepository = require('./BaseRepository');

// class UserRepository {
//   constructor(models) {
//     this.User = models.User;
//   }

//   async findByUsername(email) {
//     return await this.User.findOne({ where: { email } });
//   }

//   async getAllUsers() {
//     return await this.User.findAll({ attributes: ['id', 'name', 'email'] });
//   }

//   async createUser(name, password, email) {
//     const user = await this.User.create({ name, password, email });
//     return user.id;
//   }

//   async updateUser(userId, data) {
//     await this.User.update(data, { where: { id: userId } });
//     return true;
//   }

//   async saveResetToken(userId, token, expiry) {
//     return this.User.update({ resetToken: token, resetTokenExpiry: expiry }, { where: { id: userId } });
//   }

//   async findByResetToken(token) {
//     return await this.User.findOne({ where: { resetToken: token } });
//   }

//   async updatePasswordAndClearReset(userId, hashedPassword) {
//     return this.User.update(
//       { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
//       { where: { id: userId } }
//     );
//   }

// }



class UserRepository extends BaseRepository {
  constructor(models) {
    super(models.User); // Pass the Sequelize model to the base class
    this.models = models; // optional, if you need access to other models
  }

  async findByUsername(email) {
    return this.findByCondition({ email });
  }

  async getAllUsers() {
    return this.findAll(['id', 'name', 'email']);
  }

  async createUser(name, password, email) {
    const user = await this.create({ name, password, email });
    return user.id;
  }

  async updateUser(userId, data) {
    await this.update(userId, data);
    return true;
  }

  async saveResetToken(userId, token, expiry) {
    return this.update(userId, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });
  }

  async findByResetToken(token) {
    return this.findByCondition({ resetToken: token });
  }

  async updatePasswordAndClearReset(userId, hashedPassword) {
    return this.update(userId, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });
  }
}

module.exports = UserRepository;
