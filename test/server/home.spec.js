const express = require('../../config/express')();
const request = require('supertest')(express);

describe('#HomeController', () => {

    it('#home accept html w/ success', done => {
        request.get('/')
            .set('Accept', 'text/html')
            .expect('Content-Type', /html/)
            .expect(200)
            .end(done);
    });

});
