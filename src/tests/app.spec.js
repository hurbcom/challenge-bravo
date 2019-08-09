const request = require('supertest');
const app = require('../server');

describe('API /', function() {
    it('should return a successfull response', function(done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
});
