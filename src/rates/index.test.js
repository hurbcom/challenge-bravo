const rates = require('./index')
const mock = require('../mock/rates')

const callApi = (url) => Promise.resolve({ json: () => mock })
const fetch = jest.fn(callApi)

it('request rates', () =>
  rates.update(fetch).then(res => {
    expect(fetch).toBeCalledWith('https://openexchangerates.org/api/latest.json?app_id=7c785382c5e840f6808c4f884560051b&show_alternative=true&symbols=USD,BRL,EUR,BTC,ETH')
  }))

it('get rate after update', () =>
  rates.update(fetch).then(res => {
    expect(rates.get('BRL')).toBe(mock.rates.BRL)
  }))

it('get all rates after update', () =>
  rates.update(fetch).then(res => {
    expect(rates.get()).toEqual(mock.rates)
  }))
