/* eslint-env node, mocha */
import request from 'supertest';
import app from '../server';

describe('Teste da API conversion', () => {
    it('Carrega a página/', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&to=EUR&amount=1')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect(200, done);
    });
});
