const rates = require('./index')
const mock = require('../mock')

const callApi = (url) => Promise.resolve({ json: () => mock })
const fetch = jest.fn(callApi)

it('request rates', () =>
  rates.update(fetch, mock.process).then(res => {
    expect(fetch).toBeCalledWith('https://openexchangerates.org/api/latest.json?app_id=api1234&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH')
  }))

it('get rate after update', () =>
  rates.update(fetch, mock.process).then(res => {
    expect(rates.get('BRL')).toBe(mock.rates.BRL)
  }))

it('get all rates after update', () =>
  rates.update(fetch, mock.process).then(res => {
    expect(rates.get()).toEqual(mock.rates)
  }))
