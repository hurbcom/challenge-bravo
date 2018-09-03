var assert = require('assert');
var convert_func = require('../controllers/convert_functions');


describe("challenge-bravo", function() {
	describe("request", function() {
		it('retorno do cálculo da conversão', function() {
			convert_func.get_quotes_convertion(function(response) {
				console.log(response);
			});
			
		});

	});
});