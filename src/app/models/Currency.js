const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {}
  Currency.init(
    {
      name: DataTypes.STRING,
      symbol: DataTypes.STRING,
      rate: DataTypes.DECIMAL,
      default: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Currency',
      tableName: 'currencies',
    }
  );
  return Currency;
};
