var assert = require('assert');
var convert_func = require('../controllers/convert_functions');


describe("challenge-bravo", function() {
	describe("request", function() {
		it('retorno do cálculo final da conversão', function() {
			convert_func.convert_coin(function(response) {
				console.log(response);
			});
			
		});
		it('retorno do serviço (API cryptocompare)', function() {
			convert_func.convert_coin(function(response) {
				console.log(response);
				done();
			});
			
		});

	});
});