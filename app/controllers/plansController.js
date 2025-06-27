const express = require('express');

    //controllers/plansController.js
    const PlanService = require('../services/planService');
    const PlanRepository = require('../repositories/PlanRepository');
    const db = require('../../database/db');

    const customResponse = require('../../helpers/response');
    const { now } = require('sequelize/lib/utils');

    const Stripe = require('stripe');
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    const planRepository = new PlanRepository(db);
    const planService = new PlanService(planRepository);

    
    exports.createPlan = async (req, res) => {
        try {
            
            const user_id = req.user?.userId;
            const name = req.body.name;
            const plan_type = req.body.plan_type;
            const price = req.body.price;
            const description = req.body.description;
            const status = 1;

            const planId = await planService.createPlan(name, plan_type, price, description, user_id, status);
            return customResponse.success(res, { planId }, "Plan Created successfully", 201);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };


    exports.updatePlan = async (req, res) => {
        try {

            const userId = req.user.userId;
            const planId = req.body.plan_id;
            const { name, price, description } = req.body;

            const data = {};
            if (name) data.name = name;
            if (price) data.price = price;
            if (description) data.description = description;
            
            const plans = await planService.updatePlan(planId, data);
            if (!plans) {
                return customResponse.error(res, {},"Plan not found !", 404);
            }

            return customResponse.success(res, { plans }, "Plan updated successfully", 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };

   exports.deletePlan = async(req, res) => {
       try {
            const userId = req.user.userId;
            const planId = req.body.plan_id;
            const plans = await planService.deletePlan(planId);
            if (!plans) {
                return customResponse.error(res, {},"Plan not found", 403);
            }

            return customResponse.success(res, { plans }, "Plan deleted successfully", 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
   }

    exports.getAllPlans = async (req, res) => {
        try {
            const plans = await planService.getAllPlans();
            return customResponse.success(res, { plans }, 'Plan list fetched !', 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };

    exports.purchasePlan = async (req, res) => {
        try {
            const userId = req.user.userId;
            const { plan_id, payment_method_id } = req.body;

            const plan = await planService.getPlanById(plan_id);
            if (!plan) {
                return customResponse.error(res, {}, "Invalid Plan", 404);
            }

            // Create PaymentIntent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(plan.price * 100), // amount in cents
                currency: 'usd',
                payment_method: payment_method_id,
                confirm: true,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: 'never'
                },
                metadata: {
                    user_id: userId,
                    plan_id: plan.id
                }
            });

            // Fetch payment method details (card brand, last4, name, etc.)
            const paymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);
            // Extract card details
            const cardBrand = paymentMethod.card.brand; // e.g., "visa"
            const last4 = paymentMethod.card.last4; // e.g., "4242"
            const expMonth = paymentMethod.card.exp_month;
            const expYear = paymentMethod.card.exp_year;
            const cardholderName = paymentMethod.billing_details.name; // if provided


            // Store purchase info in DB
            await planService.storePurchase({
                user_id: userId,
                plan_id: plan.id,
                stripe_payment_id: paymentIntent.id,
                amount: plan.price,
                status: paymentIntent.status,
                card_brand: cardBrand,
                last4: last4,
                exp_month: expMonth,
                exp_year: expYear,
                cardholder_name: cardholderName
            });

            return customResponse.success(res, { paymentIntent }, 'Plan purchased successfully', 200);
        } catch (error) {
            return customResponse.error(res, error);
        }
    };



