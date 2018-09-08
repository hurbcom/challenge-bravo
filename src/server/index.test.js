const { app } = require('./index')
const request = require('supertest')

describe('Server tests', () => {
  it('required params not found', () =>
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(400))

  it('happy request', () =>
    request(app)
      .get('/?from=BTC&to=EUR&amount=123.45')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        expect(res.data).not.toBeNaN()
      }))

  it('Incorret params', () =>
    request(app)
      .get('/?from=BTS&to=EUR&amount=123.45')
      .set('Accept', 'application/json')
      .expect(400))
})
