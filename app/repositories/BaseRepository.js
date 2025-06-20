// repositories/BaseRepository.js

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findById(id) {
    return this.model.findByPk(id);
  }

  async findAll(attributes = null) {
    return this.model.findAll({ attributes });
  }

  async update(id, data) {
    return this.model.update(data, { where: { id } });
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }

  async findByCondition(condition) {
    return this.model.findOne({ where: condition });
  }
}

module.exports = BaseRepository;
