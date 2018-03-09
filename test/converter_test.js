const should = require('should')
const converter = require('../converter')
var fakeQuote = {}
fakeQuote['USD']=2
fakeQuote['BRL']=1
describe('Convert suite', () => {
    it('should_return_a_number', () => {
        let result = converter('BRL', 'USD', 10.2, fakeQuote)        
        result.should.be.type('number')
    })
})