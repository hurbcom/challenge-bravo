const converterService = require('../services/converter')
const redisClient = require('../redis')
const expect = require('chai').expect

before('set redis keys to expected value', async () => {
    const mockRates = {
        'MBRL': 3.686905,
        'MBTC': 0.000155926194,
        'METH': 0.004996128,
        'MEUR': 0.879484,
        'MUSD': 1
    }
    let promises = []
    for(let key in mockRates){
        promises.push(redisClient.set(key, mockRates[key]))
    }
    await Promise.all(promises)
});

describe('#converter() tests', () =>{
    it('USD to USD', async () => {
        let value = await converterService.currencyConvert('MUSD', 'MUSD', 1)
        expect(value).to.equal(1);
    })

    it('USD to BRL', async () => {
        let value = await converterService.currencyConvert('MUSD', 'MEUR', 4.675)
        expect(value).to.be.closeTo(4.111, 0.001);
    })

    it('BTC to EUR', async () => {
         let value = await converterService.currencyConvert('MBTC', 'MEUR', 15)
         expect(value).to.be.closeTo(84605.797, 0.001);
    })

    it('ETH to BRL', async () => {
        let value = await converterService.currencyConvert('METH', 'MBRL', 0.0001)
        expect(value).to.be.closeTo(0.08, 0.01);
   })
})
