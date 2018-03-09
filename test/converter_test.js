const should = require('should')
const converter = require('../converter')
describe('Convert suite', () => {
    it('should_return_a_number', () => {
        let result = converter('BRL', 'USD', 10.2)
        result.should.be.type('number')
    })
})