/* eslint-env node, mocha */
import request from 'supertest';
import app from '../server';

describe('Teste de integração: API conversion - /api/conversion', () => {
    it('Deve retornar 417 e a mensagem de erro por faltar o parametro FROM na QUERY', (done) => {
        request(app)
            .get('/api/conversion?to=EUR&amount=1')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(417, {
                error: true,
                message: 'Bad request: missing paramentreo FROM in query',
            }, done);
    });

    it('Deve retornar 417 e a mensagem de erro por faltar o parametro TO na QUERY', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&amount=1')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(417, {
                error: true,
                message: 'Bad request: missing paramentreo TO in query',
            }, done);
    });

    it('Deve retornar 417 e a mensagem de erro por faltar o parametro AMOUNT na QUERY', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&to=EUR')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(417, {
                error: true,
                message: 'Bad request: missing paramentreo AMOUNT in query',
            }, done);
    });

    it('Deve retornar 404 e a mensagem de erro por solicitar conversão de FROM para moeda não suportada', (done) => {
        request(app)
            .get('/api/conversion?from=CLP&to=EUR&amount=1')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(404, {
                error: true,
                message: 'The CLP currency sent to conversion is not accepted. Use one of the following currencies: USD,BRL,EUR,BTC,ETH',
            }, done);
    });

    it('Deve retornar 404 e a mensagem de erro por solicitar conversão de TO para moeda não suportada', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&to=CLP&amount=1')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(404, {
                error: true,
                message: 'The CLP currency sent to conversion is not accepted. Use one of the following currencies: USD,BRL,EUR,BTC,ETH',
            }, done);
    });

    it('Deve retornar 417 e a mensagem de erro pois o parametro AMOUNT deve ser um número maior que ZERO e foi enviado 0', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&to=EUR&amount=0')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(417, {
                error: true,
                message: 'Bad request: AMOUNT must be a number and greater than zero',
            }, done);
    });

    it('Deve retornar 417 e a mensagem de erro pois o parametro AMOUNT deve ser um número maior que ZERO e foi enviado RIO', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&to=EUR&amount=RIO')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(417, {
                error: true,
                message: 'Bad request: AMOUNT must be a number and greater than zero',
            }, done);
    });

    it('Deve realzar a chamada com sucesso e receber o json com os dados da conversão de BRL para EUR', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&to=EUR&amount=10')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('Deve realzar a chamada com sucesso e receber o json com os dados da conversão de EUR para USD', (done) => {
        request(app)
            .get('/api/conversion?from=BRL&to=EUR&amount=150')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('Deve realzar a chamada com sucesso e receber o json com os dados da conversão de ETH para BRL', (done) => {
        request(app)
            .get('/api/conversion?from=ETH&to=BRL&amount=0.1')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('Deve realzar a chamada com sucesso e receber o json com os dados da conversão de BTC para EUR', (done) => {
        request(app)
            .get('/api/conversion?from=BTC&to=EUR&amount=10')
            .expect('content-type', 'application/json; charset=utf-8')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
