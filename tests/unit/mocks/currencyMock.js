const SequelizeMock = require('sequelize-mock');
const faker = require('faker');

const dbMock = new SequelizeMock();

const createCurrencyMock = (x = 1, symbol = 'BRL') => {
  const currency = {
    id: x,
    name: faker.name.lastName(),
    symbol,
    rate: 0.2354,
    default: true,
  };

  return currency;
};

const currencyMock = dbMock.define('Currency', createCurrencyMock());

currencyMock.$queryInterface.$useHandler((query) => {
  if (query === 'findAll') {
    const result = [];
    for (let x = 0; x < 5; x += 1) {
      const currency = createCurrencyMock(x, faker.name.lastName().substr(0, 3).toUpperCase());
      result.push(currencyMock.build(currency));
    }
    return result;
  }
});

module.exports = currencyMock;
