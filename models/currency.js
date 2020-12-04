'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Currency.init({
    currency_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    indexes: [{unique: true, fields: ['currency_name']}],
    sequelize,
    modelName: 'Currency',
  });
  return Currency;
};