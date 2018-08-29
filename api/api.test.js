const api = require('./api');
const request = require('supertest');
const expect = require('expect');

test('Request for currency conversion', (done) => {
  request(api)
    .get('/api?from=USD&to=BRL&amount=1')
    .expect(200)
    .expect('content-type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.body)
        .toHaveProperty('from')
      expect(res.body)
        .toHaveProperty('to')
      expect(res.body)
        .toHaveProperty('amount')
      expect(res.body)
        .toHaveProperty('result')
    })
    .end((err, res) => {
      if (err) done(err);
      done();
    })
});

test('Request with invalid parameters', (done) => {
  request(api)
    .get('/api?frrom=USD&troll=BRL&house=1')
    .expect(500)
    .expect('content-type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) done(err);
      done();
    })
});

test('Request with the invalid currency code in the FROM parameter', (done) => {
  request(api)
    .get('/api?from=USSSD&to=BRL&amount=1')
    .expect(500)
    .expect('content-type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) done(err);
      done();
    })
});

test('Request with the invalid currency code in the TO parameter', (done) => {
  request(api)
    .get('/api?from=USD&to=BRRRL&amount=1')
    .expect(500)
    .expect('content-type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) done(err);
      done();
    })
});

test('Request with a non-numeric parameter in AMOUNT', (done) => {
  request(api)
    .get('/api?from=USD&to=BRL&amount=API_TEST')
    .expect(500)
    .expect('content-type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) done(err);
      done();
    })
});

test('Request for a non-existent path', (done) => {
  request(api)
    .get('/api-test?from=USD&to=BRL&amount=API_TEST')
    .expect(404)
    .expect('content-type', 'application/json; charset=utf-8')
    .end((err, res) => {
      if (err) done(err);
      done();
    })
});