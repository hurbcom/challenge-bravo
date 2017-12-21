var express = require('../config/express')();
var request = require('supertest')(express);

describe('#ConvertController', function () {

    it('#convert', function (done) {
        request.get('/convert?from=USD&to=BRL&amount=1')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
                if (!('request' in res.body)) throw new Error("missing request key");
                if (!('meta' in res.body)) throw new Error("missing meta key");
                if (!('response' in res.body)) throw new Error("missing response key");
            })
            .end(done);
    });

});
