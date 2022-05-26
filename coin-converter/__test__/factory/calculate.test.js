const factoryCalculate = require('../../src/factory/calculate')

test('It should validate calculate correct ETH-BTC.', () => {

    const quoteFrom = 1.93676
    const value = 100.0
    const quoteTo = 29.698

    const received = factoryCalculate.conversion(quoteFrom, value, quoteTo)

    expect(received).toEqual(6.521516600444475)
})

test('It should validate calculate correct USD-EUR.', () => {

    const quoteFrom = 1
    const value = 100.0
    const quoteTo = 1.0704

    const received = factoryCalculate.conversion(quoteFrom, value, quoteTo)

    expect(received).toEqual(93.42301943198804)
})
