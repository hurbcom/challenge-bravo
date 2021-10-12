const exchangeService = require("../../service/exchangeService")

test("Converting between bases", () => {
    const data = {
        USD: 1,
        BRL: 0.1806,
        EUR: 1.1553,
        BTC: 57283.6,
        ETH: 3519.53,
    }

    expect(exchangeService("USD","BRL",data)).toStrictEqual(5.537098560354374)
    
    expect(exchangeService("USD","EUR",data)).toStrictEqual(0.8655760408551891)
    
    expect(exchangeService("BRL","USD",data)).toStrictEqual(0.1806)
    
    expect(exchangeService("EUR","BRL",data)).toStrictEqual(6.397009966777408)
    
})