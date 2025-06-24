// repositories/IPostRepository.js
class IPostRepository {
    
  getPostById(id) {
    throw new Error('getPostById() must be implemented');
  }
   async findByOne(email) {
     throw new Error('findByOne() must be implemented');
  }

  createPost(data) {
    throw new Error('createPost() must be implemented');
  }

  updatePost(id, data) {
    throw new Error('updatePost() must be implemented');
  }
  
  getAllPosts() {
    throw new Error('getAllPosts() must be implemented');
  }

  filterPosts() {
    throw new Error('filterPosts() must be implemented');
  }
}

module.exports = IPostRepository;
