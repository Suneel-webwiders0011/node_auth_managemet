const express = require('express');
const router = express.Router();
const validate = require('../app/middleware/validate');
const planController = require('../app/controllers/plansController');
const checkAuth = require('../app/middleware/checkAuth');

router
    .route('/')
    .get(checkAuth, planController.getAllPlans)
    .post(checkAuth, planController.createPlan)
    .put(checkAuth, planController.updatePlan)
    .delete(checkAuth, planController.deletePlan);
    
router.post('/purchase', checkAuth, planController.purchasePlan);    

module.exports = router;    