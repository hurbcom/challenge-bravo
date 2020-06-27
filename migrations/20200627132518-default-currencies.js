'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    //data table creation
    await queryInterface.createTable('currencies', {
      id: {
          type: DataTypes.UUIDV4,
          primaryKey: true
      },
      name: DataTypes.STRING,
      createdAt: {
          type: DataTypes.DATE
      },
      updatedAt: {
          type: DataTypes.DATE
      }
    });

    await queryInterface.bulkInsert('currencies', [
      {
        id: '26bf03e2-9454-492b-97c2-48f48fd9f30d',
        createdAt: new Date(),
        name: 'USD',
        updatedAt: new Date(),
      },
      {
        id: '5f7d9363-8b97-4793-9958-e5a40bdfde86',
        createdAt: new Date(),
        name: 'BRL',
        updatedAt: new Date(),
      },
      {
        id: '5d5ddac4-99bc-475b-ae15-f25f533591eb',
        createdAt: new Date(),
        name: 'EUR',
        updatedAt: new Date(),
      },
      {
        id: '1fca2651-e819-4956-aa4f-6ce77b984e05',
        createdAt: new Date(),
        name: 'BTC',
        updatedAt: new Date(),
      },
      {
        id: '1c80beef-72b1-40b9-9b9b-ed1c617edd24',
        createdAt: new Date(),
        name: 'ETH',
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**/
  }
};
