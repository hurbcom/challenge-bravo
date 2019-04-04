require('dotenv').config()
const ratesService = require('./../../services/rates')
const redisClient = require('./../../config/redis')
const expect = require('chai').expect

before('clear redis before test', async () => {
    // Call the conversion tests
    require('./convert-tests')
    // Clean old result
    await redisClient.del(['USD', 'BRL', 'EUR', 'BTC', 'ETH'])
})

describe('#update on radis', () => {
    it('check if cotacoes really update on radis', async () => {
        await ratesService.update()
        let rates = await redisClient.mget(['USD', 'BRL', 'EUR', 'BTC', 'ETH'])
        expect(rates).to.be.an('array')
        expect(rates).to.have.length(5)
        expect(rates).to.be.all.not.null
        expect(rates).to.be.all.not.NaN
    })
})