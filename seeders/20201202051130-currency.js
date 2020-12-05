'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Currencies', [
      {
        currency_name: 'USD',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      },
      {
        currency_name: 'BRL',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      },
      {
        currency_name: 'EUR',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      },
      {
        currency_name: 'BTC',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      },
      {
        currency_name: 'ETH',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString()
      }
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('Currencies', null, {});
    
  }
};
