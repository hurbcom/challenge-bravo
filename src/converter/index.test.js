const mock = require('../mock')
const rates = require('../rates')
const converter = require('../converter')

describe('Converter tests', () => {
  const fetch = (url) => Promise.resolve({ json: () => mock })
  rates.update(fetch, mock.process)

  it('convert BRL to BTC', () => {
    let val = converter.from('BRL').to('BTC').value(1)
    expect(val).toEqual(0.00003257879238383911)
  })

  it('convert BRL to USD', () => {
    let val = converter.from('BRL').to('USD').value(4.15695)
    expect(val).toBe(1)
  })

  it('convert BTC to ETH', () => {
    let val = converter.from('BTC').to('ETH').value(2)
    expect(val).toEqual(51.34445829095639)
  })
})
