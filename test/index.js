const chai = require('chai'),
    assert = chai.assert,
	app = require('../config'),
	db = require('../persistence/db');

describe('Teste Unitário', (_) => {
	const exchange = new app.services.exchange();

    it('1 BRL para USD',()=>{
	    let result = exchange.convert({from:'BRL',to:'USD',amount:1})
	    assert.equal(result,0.24)
    })

	it('1 EUR para USD',()=>{
	    let result = exchange.convert({from:'EUR',to:'USD',amount:1})
	    assert.equal(result,1.10)
    })

    it('1 BTC para USD',()=>{
	    let result = exchange.convert({from:'BTC',to:'USD',amount:1})
	    assert.equal(result,7261.09)
    })

    it('1 ETH para USD',()=>{
	    let result = exchange.convert({from:'ETH',to:'USD',amount:1})
	    assert.equal(result,151.29)
    })
    

    it('1 USD para BRL',()=>{
	    let result = exchange.convert({from:'USD',to:'BRL',amount:1})
	    assert.equal(result,4.20)
    })

    it('1 USD para EUR',()=>{
	    let result = exchange.convert({from:'USD',to:'EUR',amount:1})
	    assert.equal(result,0.91)
    })

    it('1 USD para BTC',()=>{
	    let result = exchange.convert({from:'USD',to:'BTC',amount:1})
	    assert.equal(result,0.00014)
    })

    it('1 USD para ETH',()=>{
	    let result = exchange.convert({from:'USD',to:'ETH',amount:1})
	    assert.equal(result,0.0066)
    })

	it('2000 USD para BRL', () => {
		let result = exchange.convert({ from: 'USD', to: 'BRL', amount: 2000 });
		assert.equal(result, 8400);
    });
    
    it('2000 USD para EUR', () => {
		let result = exchange.convert({ from: 'USD', to: 'EUR', amount: 2000 });
		assert.equal(result, 1820);
    });
    
    it('2000 USD para BTC', () => {
		let result = exchange.convert({ from: 'USD', to: 'BTC', amount: 2000 });
		assert.equal(result, 0.27999999999999997);
    });
    
    it('2000 USD para ETH', () => {
		let result = exchange.convert({ from: 'USD', to: 'ETH', amount: 2000 });
		assert.equal(result, 13.20);
	});

	it('2000 BRL para USD',()=>{
	    let result = exchange.convert({from:'BRL',to:'USD',amount:2000})
	    assert.equal(result,480)
    })
    
    it('2000 EUR para USD',()=>{
	    let result = exchange.convert({from:'EUR',to:'USD',amount:2000})
	    assert.equal(result,2200)
	})
	
	it('1 BRL para EUR',()=>{
		let result = exchange.convert({from:'BRL',to:'EUR',amount:1})
	    assert.equal(result,4.62)
	})

	it('1 BRL para BTC',()=>{
		let result = exchange.convert({from:'BRL',to:'BTC',amount:1})
	    assert.equal(result,30496.58)
	})

	it('1 BRL para ETH',()=>{
		let result = exchange.convert({from:'BRL',to:'ETH',amount:1})
	    assert.equal(result,635.42)
	})

	it('1 EUR para BRL',()=>{
		let result = exchange.convert({from:'EUR',to:'BRL',amount:1})
	    assert.equal(result,0.22)
	})
    
});
