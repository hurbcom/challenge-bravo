const ratesService = require('../services/rates')
const redisClient = require('../redis')
const expect = require('chai').expect

before('clear redis before test', async () => {
    await redisClient.del(['USD', 'BRL', 'EUR', 'BTC', 'ETH'])
})

describe('#updateRates', () => {
    it('check if updates really update on redis', async () => {
        await ratesService.updateRates('4ca36050e7d245008efefa40eabbd4d1')    
        let rates = await redisClient.mget(['USD', 'BRL', 'EUR', 'BTC', 'ETH'])
        expect(rates).to.be.an('array')
        expect(rates).to.have.length(5)
        expect(rates).to.be.all.not.null
        expect(rates).to.be.all.not.NaN
    })
})