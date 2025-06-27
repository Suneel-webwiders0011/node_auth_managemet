'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlanPurchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PlanPurchase.init({
    user_id: DataTypes.INTEGER,
    plan_id: DataTypes.INTEGER,
    stripe_payment_id: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    card_brand: DataTypes.STRING,
    last4: DataTypes.STRING,
    exp_month: DataTypes.INTEGER,
    exp_year: DataTypes.INTEGER,
    cardholder_name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PlanPurchase',
  });
  return PlanPurchase;
};