const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class PlanService {
    constructor(planRepository) {
        this.planRepository = planRepository;
        this.jwtSecret = process.env.JWT_SECRET;
    }

    async getPlanById(planId) {
        return await this.planRepository.getPlanById(planId);
    }

    async getAllPlans() {
        return await this.planRepository.getAllPlans();
    }

    async createPlan(name, plan_type, price, description, user_id, status) {
        return await this.planRepository.createPlan({ name, plan_type, price, description, user_id, status });
    }


    async updatePlan(planId, data) {
        const plan = await this.planRepository.getPlanById(planId);

        if (!plan) {
            return false;
        }
        return await this.planRepository.updatePlan(planId, data);
    }


    async deletePlan(planId) {
        const plan = await this.planRepository.getPlanById(planId);
        if (!plan) {
            return false;
        }
        return await this.planRepository.deletePlans(planId);

    }

    async storePurchase(data) {
        return await this.planRepository.storePurchase(data);
    }



}

module.exports = PlanService;
