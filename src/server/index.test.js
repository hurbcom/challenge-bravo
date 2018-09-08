const { app } = require('./index')
const request = require('supertest')
const mock = require('../mock')
const { update } = require('../rates')

describe('Server tests', () => {
  const fetch = (url) => Promise.resolve({ json: () => mock })
  update(fetch, mock.process)
  it('required params not found', () =>
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(400))

  it('happy request', () =>
    request(app)
      .get('/?from=BTC&to=EUR&amount=123.45')
      .set('Accept', 'application/json')
      .expect(res => {
        expect(res.status).toBe(200)
        expect(res.body.data).not.toBeNaN()
        expect(res.body.data).not.toBeNull()
      }))

  it('Incorret params', () =>
    request(app)
      .get('/?from=BTS&to=EUR&amount=123.45')
      .set('Accept', 'application/json')
      .expect(400))
})
