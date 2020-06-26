'use strict';

import { getCurrencyModel, getDefaultCurrencyData } from "../model/currency";

module.exports = {
  up: async (queryInterface: any, DataTypes: any, Sequelize: any) => {
    // associo o model a migration
    await queryInterface.createTable(process.env.ORM_TABLENAME, getCurrencyModel());
    // populo os dados 
    await queryInterface.bulkInsert(process.env.ORM_TABLENAME, getDefaultCurrencyData(), {});
  },
  down: async (queryInterface: any, Sequelize: any) => { }
};
