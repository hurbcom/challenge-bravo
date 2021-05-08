'use strict';

const sequelize = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("currencies",{
        id:{
          type:sequelize.INTEGER,
          primaryKey:true,
          autoIncrement:true,
          allowNull:false
        },
        name:{
          type:sequelize.STRING,
          allowNull:false
        },
        code:{
          type:sequelize.STRING,
          allowNull:false,
          unique:true
        },
        icon:{
          type:sequelize.STRING,
          allowNull:true
        },
        value:{
          type:sequelize.FLOAT,
          allowNull:false
        },
        fictional:{
          type:sequelize.BOOLEAN,
          allowNull:false
        },
        created_at:{
          type:sequelize.DATE,
          allowNull:false
        },
        updated_at:{
          type:sequelize.DATE,
          allowNull:false
        }

    })
  },

  down: async (queryInterface, Sequelize) => {
      return queryInterface.dropTable("currencies")
  }
};
