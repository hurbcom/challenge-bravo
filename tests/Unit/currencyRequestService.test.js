const currencyS = require('../../src/services/currencyRequestService');

test('validate convert currency fields', () => {
  let data = {
    'from': 'USD',
    'to': 'BRL',
    'amount': 1
  };
  expect(currencyS.validateConvertCurrencyFields(data, [])).toHaveLength(2);
  expect(currencyS.validateConvertCurrencyFields(data, ['USD', 'BRL'])).toHaveLength(0);
  data['amount'] = 'NOT_NUMERIC';
  expect(currencyS.validateConvertCurrencyFields(data, ['USD', 'BRL'])).toHaveLength(1);
});