const IPlanRepository = require('./IPlanRepository');
const { Op } = require('sequelize');

class PlanRepository extends IPlanRepository{
    /**
     * Initializes the repository with a database connection.
     * @param {Object} db - Sequelize instance containing models.
     */
    constructor(db) {
        super();
        this.db = db;
    }

    async getPlanById(id) {
        return this.db.Plans.findByPk(id);
    }

    async createPlan(data) {
        return this.db.Plans.create(data);
    }

    async updatePlan(planId, data) {
        return this.db.Plans.update(data, {
            where: {
                id: planId
            }
        });
    }

    async getAllPlans() {
        return await this.db.Plans.findAll(); 
    }

    async deletePlans(planId) {
        return await this.db.Plans.destroy({
            where: {
                id: planId,
            }
        });
    }

    async storePurchase(data) {
        return await this.db.PlanPurchases.create(data);
    }

}

module.exports = PlanRepository;