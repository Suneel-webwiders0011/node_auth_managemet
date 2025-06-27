'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('PlanPurchases', 'card_brand', Sequelize.STRING);
    await queryInterface.addColumn('PlanPurchases', 'last4', Sequelize.STRING);
    await queryInterface.addColumn('PlanPurchases', 'exp_month', Sequelize.INTEGER);
    await queryInterface.addColumn('PlanPurchases', 'exp_year', Sequelize.INTEGER);
    await queryInterface.addColumn('PlanPurchases', 'cardholder_name', Sequelize.STRING);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
