const request = require('supertest')
const app = require('../index')
const expect = require('chai').expect
require("./rates-test")

describe('#convert() test controller', () => {
    it(`Request don't fullfil the params`, () =>
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(400))

    it(`Param "amount" is not a number`, () =>
        request(app)
            .get('/?from=EUR&to=BrL&amount=batata')
            .set('Accept', 'application/json')
            .expect(400))
    
    it(`Param "from" is a invalid currency`, () =>
        request(app)
            .get('/?from=PTS&to=BrL&amount=1')
            .set('Accept', 'application/json')
            .expect(401))
    
    it(`Param "to" is a invalid currency`, () =>
        request(app)
            .get('/?from=USD&to=MEN&amount=1')
            .set('Accept', 'application/json')
            .expect(401))

    it(`Correct request`, () =>
        request(app)
            .get('/?from=EUR&to=BRL&amount=1.6534')
            .set('Accept', 'application/json')
            .expect(response => {
                expect(response.status).to.be.equal(200)
                expect(response.body.result).not.to.be.undefined
                expect(response.body.result).not.to.be.NaN
                expect(response.body.result).not.to.be.null
            }))

})