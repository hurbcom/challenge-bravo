const expect = require('chai').expect;
const request = require('supertest');
const nock = require('nock');
const app = require('../server');
const config = require('../config');

describe('API /convert', function() {
    let path = '/convert';

    afterEach(function() {
        nock.cleanAll();
    });

    it('should return a 400 error if "from" parameter does not exist', function(done) {
        request(app)
            .get(path)
            .expect(400, done);
    });

    it('should return a 422 error if "from" parameter is invalid', function(done) {
        const from = 'teste';

        request(app)
            .get(`${path}?from=${from}`)
            .expect(422, done);
    });

    it('should return a 400 error if "to" parameter does not exist', function(done) {
        const from = 'USD';

        request(app)
            .get(`${path}?from=${from}`)
            .expect(400, done);
    });

    it('should return a 422 error if "to" parameter is invalid', function(done) {
        const from = 'USD';
        const to = 'teste';

        request(app)
            .get(`${path}?from=${from}&to=${to}`)
            .expect(422, done);
    });

    it('should return a 400 error if "amount" parameter does not exist', function(done) {
        const from = 'USD';
        const to = 'BRL';

        request(app)
            .get(`${path}?from=${from}&to=${to}`)
            .expect(400, done);
    });

    it('should return a 422 error if "amount" parameter is not a number', function(done) {
        const from = 'USD';
        const to = 'BRL';
        const amount = 'teste';

        request(app)
            .get(`${path}?from=${from}&to=${to}&amount=${amount}`)
            .expect(422, done);
    });

    it('should return a 500 error if the request to the conversion API fail', function(done) {
        const from = 'USD';
        const to = 'BRL';
        const amount = 100;

        nock(config.conversionApiUrl)
            .get(`/data/price?fsym=${from}&tsyms=${to}`)
            .reply(500);

        request(app)
            .get(`${path}?from=${from}&to=${to}&amount=${amount}`)
            .expect(500)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal('An error occurred');
                done();
            });
    });

    it('should return the correct result from the conversion', function(done) {
        const from = 'USD';
        const to = 'BRL';
        const rate = 0.25;
        const amount = Number(100).toFixed(2);

        const crytoCompareResponse = {
            [to]: rate
        };

        const expectedResult = {
            from,
            to,
            amount,
            result: (amount * crytoCompareResponse[to]).toFixed(2)
        };

        nock(config.conversionApiUrl)
            .get(`/data/price?fsym=${from}&tsyms=${to}`)
            .reply(200, crytoCompareResponse);

        request(app)
            .get(`${path}?from=${from}&to=${to}&amount=${amount}`)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.deep.equal(expectedResult);
                done();
            });
    });
});
