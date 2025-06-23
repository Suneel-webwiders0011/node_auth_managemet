// repositories/IUserRepository.js
class IUserRepository {
  getUserById(id) {
    throw new Error('getUserById() must be implemented');
  }
   async findByOne(email) {
     throw new Error('findByUsername() must be implemented');
  }

  createUser(data) {
    throw new Error('createUser() must be implemented');
  }

  updateUser(id, data) {
    throw new Error('updateUser() must be implemented');
  }
  
  getAllUsers() {
    throw new Error('getAllUsers() must be implemented');
  }
}

module.exports = IUserRepository;
