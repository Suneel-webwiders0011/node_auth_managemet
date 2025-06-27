// repositories/IPlanRepository.js
class IPlanRepository {
    
  getPlanById(id) {
    throw new Error('getPlanById() must be implemented');
  }
  
   async findByOne(email) {
     throw new Error('findByOne() must be implemented');
  }

  createPlan(data) {
    throw new Error('createPlan() must be implemented');
  }

  updatePlan(id, data) {
    throw new Error('updatePlan() must be implemented');
  }
  
  getAllPlans() {
    throw new Error('getAllPlans() must be implemented');
  }

  deletePlans() {
    throw new Error('deletePlans() must be implemented');
  }

}

module.exports = IPlanRepository;
