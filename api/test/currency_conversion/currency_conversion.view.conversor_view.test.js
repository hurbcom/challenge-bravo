const sinon = require('sinon');
const request = require('request');
const conversor = require('../../src/currency_conversion/controller/conversor_controller.js');
const chai = require('chai');
const should = chai.should();

const base = 'http://localhost:5000';

describe('Conversor de moedas: GET / ', () => {

    describe('when stubbed', () => {

        it('Request invalido: Moeda invalido', (done) => {
            const from = 'ABC';
            const to = 'USD';
            const amount = 12.3;

            request.get(`${base}/currency?from=${from}&to=${to}&amount=${amount}`, (req, res, body) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');

                body = JSON.parse(body);
                body.should.include.keys('success', 'message');

                body.success.should.eql(false);
            }  );
                done();

        });

        it('Request invalido: Valor invalido', (done) => {
            const from = 'ABC';
            const to = 'USD';
            const amount = 'abc';

            request.get(`${base}/currency?from=${from}&to=${to}&amount=${amount}`, (req, res, body) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');

                body = JSON.parse(body);
                body.should.include.keys('success', 'message');

                body.success.should.eql(false);
            }  );
            done();

        });
    });

});