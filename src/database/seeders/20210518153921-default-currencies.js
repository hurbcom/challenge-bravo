module.exports = {
    up: async (queryInterface) => {
      /**
       * Add seed commands here.
       *
       * Example:
       * await queryInterface.bulkInsert('People', [{
       *   name: 'John Doe',
       *   isBetaMember: false
       * }], {});
       */
      await queryInterface.bulkInsert('currencies', [
        {
          name: 'Dollar',
          symbol: 'USD',
          rate: 1,
          default: true,
        },
        {
          name: 'Real',
          symbol: 'BRL',
          rate: 0.1863,
          default: true,
        },
        {
          name: 'Euro',
          symbol: 'EUR',
          rate: 1.2179,
          default: true,
        },
        {
          name: 'Bitcoin',
          symbol: 'BTC',
          rate: 37662,
          default: true,
        },
        {
          name: 'Ethereum',
          symbol: 'ETH',
          rate: 2341.35,
          default: true,
        },
      ]);
    },
  
    down: async () => {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {});
       */
    },
  };
  