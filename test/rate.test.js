/**
 * Arquivo: rate.test.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por realizar testes na API
 * Data: 01/12/2018
 */ 
'use strict'
const request = require ('supertest');
const app = require ('../src/app');

describe('GET /api/rates', function () {
    it('respond with error in required parameters', function (done) {
        request(app)
            .get('/api/rates')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done);
    }),
    it('respond with invalid currency in parameter "to"', function (done) {
        request(app)
            .get('/api/rates?from=USD&to=AAA&amount=1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);
    }),
    it('respond with invalid currency in parameter "from"', function (done) {
        request(app)
            .get('/api/rates?from=AAA&to=USD&amount=1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);
    }),
    it('respond that the parameter "amount" must be numeric.', function (done) {
        request(app)
            .get('/api/rates?from=BRL&to=USD&amount=AAA')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);
    }),
    it('respond to the converted currency.', function (done) {
        request(app)
            .get('/api/rates?from=BRL&to=USD&amount=1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    
});

