const service = require('../../../src/app/services/currency.service');

jest.mock('../../../src/app/models/Currency', () => () => {
  // eslint-disable-next-line global-require
  return require('../mocks/currencyMock');
});

test('A currency must be returned by the identification symbol', async () => {
  const result = await service.getBySymbol('BRL');
  expect(result.symbol).toEqual('BRL');
});

test('must return all as registered currencies', async () => {
  const result = await service.getAll();
  expect(result.length).toEqual(5);
});
