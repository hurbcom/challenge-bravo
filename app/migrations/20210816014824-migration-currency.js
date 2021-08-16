'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable("currencies",{
    id:{
      type: Sequelize.INTEGER,
      allowNull:false,
      autoIncrement: true,
      primaryKey:true
    },
    code:{
      type: Sequelize.STRING(100),
      allowNull:false,
      unique: true
    },
    usd_value: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }),

  down: (queryInterface) => queryInterface.dropTable("currencies")
};
