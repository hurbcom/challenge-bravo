const converterService = require('./../../services/conversion')
const redisClient = require('./../../config/redis')
const expect = require('chai').expect

before('set redis values for expected result', async () => {
    const mockRates = {
        'BRL': 4.70,
        'BTC': 0.000266101,
        'ETH': 0.004895162,
        'EUR': 0.579484,
        'USD': 2
    }
    let promises = []
    for (let key in mockRates) {
        promises.push(redisClient.set(key, mockRates[key]))
    }
    await Promise.all(promises)
});

describe('#Conversion', () => {
    it('USD to USD', async () => {
        let value = await converterService.currency('USD', 'USD', 2)
        expect(value).to.be.eq(2);
    })

    it('BTC to EUR', async () => {
        let value = await converterService.currency('BTC', 'EUR', 15)
        expect(value).to.be.eq(32665.26619591809)
    })

    it('USD to BRL', async () => {
        let value = await converterService.currency('USD', 'EUR', 4.700)
        expect(value).to.be.eq(1.3617874)
    })

    it('ETH to BRL', async () => {
        let value = await converterService.currency('ETH', 'BRL', 0.0001)
        expect(value).to.be.closeTo(0.10, 0.01);
    })
})