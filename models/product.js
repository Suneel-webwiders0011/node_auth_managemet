'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    product_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    variant_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    discount_type: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};