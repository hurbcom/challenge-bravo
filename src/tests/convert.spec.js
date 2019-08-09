const request = require('supertest');
const app = require('../server');

describe('API /convert', function() {
    let path = '/convert';

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
});
