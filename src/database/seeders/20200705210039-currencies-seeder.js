'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('currencies', [{
      name: 'United States Dollar',
      symbol: 'USD',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: "Brazilian Real",
      symbol: "BRL",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: "Euro",
      symbol: "EUR",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('currencies', null, {});
  }
};
