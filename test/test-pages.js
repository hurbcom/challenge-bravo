var expect  = require('chai').expect;
var http = require('http');

it('Check if "/rates"\'s page response has its basic properties', function(done) {
    http.get('http://localhost:3000/rates' , (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk });
        resp.on('end', () => {
            expect(JSON.parse(data)).to.have.property('rates');
            expect(JSON.parse(data)).to.have.property('base');
            expect(JSON.parse(data)).to.have.property('date');
            done();
        });
        resp.on('error', (error) => { console.log(error) });
    });
});

it('Check if "/rates"\'s page response has BTC and ETH crypto coins', function(done) {
    http.get('http://localhost:3000/rates' , (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk });
        resp.on('end', () => {
            expect(JSON.parse(data).rates).to.have.property('BTC');
            expect(JSON.parse(data).rates).to.have.property('ETH');
            done();
        });
        resp.on('error', (error) => { console.log(error) });
    });
});