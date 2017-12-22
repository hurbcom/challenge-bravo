const express = require('../config/express')();
const request = require('supertest')(express);

describe('#ConvertController', () => {

    it('#convert w/ success', done => {
        request.get('/convert?from=USD&to=BRL&amount=1')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res => {
                if (!('request' in res.body)) throw new Error('missing request key');
                if (!('meta' in res.body)) throw new Error('missing meta key');
                if (!('response' in res.body)) throw new Error('missing response key');
            })
            .end(done);
    });

    it('#convert w/o query from', done => {
        request.get('/convert?to=BRL&amount=1')
            .expect('Content-Type', /json/)
            .expect(422)
            .expect(res => {
                if (!('errors' in res.body)) throw new Error('missing errors from key');
            })
            .end(done);
    });

    it('#convert w/o query to', done => {
        request.get('/convert?from=USD&amount=1')
            .expect('Content-Type', /json/)
            .expect(422)
            .expect(res => {
                if (!('errors' in res.body)) throw new Error('missing errors to key');
            })
            .end(done);
    });

    it('#convert w/o query amount', done => {
        request.get('/convert?from=USD&amount=1')
            .expect('Content-Type', /json/)
            .expect(422)
            .expect(res => {
                if (!('errors' in res.body)) throw new Error('missing errors amount key');
            })
            .end(done);
    });
});
