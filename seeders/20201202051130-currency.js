'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Currencies', [
      {
        currency_name: 'USD',
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        currency_name: 'BRL',
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        currency_name: 'EUR',
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        currency_name: 'BTC',
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        currency_name: 'ETH',
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('Currencies', null, {});
    
  }
};
