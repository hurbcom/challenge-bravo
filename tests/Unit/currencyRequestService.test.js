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

test('validate add currency fields', () => {
  let data = {
    'currency': 'CAD',
    'usd_value': 0.8
  };

  expect(currencyS.validateAddCurrencyFields(data, [])).toEqual([]);
  expect(currencyS.validateAddCurrencyFields(data, ['CAD'])).toHaveLength(1);
  data['usd_value'] = 'NOT_NUMERIC';
  expect(currencyS.validateAddCurrencyFields(data, ['CAD'])).toHaveLength(2);
});

test('validate remove currency fields', () => {
  expect(currencyS.validateRemoveCurrencyFields('CAD', ['CAD'])).toEqual([]);
  expect(currencyS.validateRemoveCurrencyFields('CAD', [])).toHaveLength(1);
});