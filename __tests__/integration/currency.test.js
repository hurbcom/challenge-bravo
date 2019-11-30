import request from 'supertest'

import app from '../../src/app'

describe('Currency tests', () => {
  it('should convert BTC to EUR with amount equal 123.45', async () => {
    const response = await request(app)
      .get('/currencies')
      .query({
        from: 'BTC',
        to: 'EUR',
        amount: 123.45
      })

    expect(response.status).toBe(200)
  })

  it('shouldn\'t convert with invalid to currency', async () => {
    const response = await request(app)
      .get('/currencies')
      .query({
        from: 'BTC',
        to: 'TEST',
        amount: 321.54
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('To currency not found')
  })

  it('shouldn\'t convert with invalid from currency', async () => {
    const response = await request(app)
      .get('/currencies')
      .query({
        from: 'TEST',
        to: 'BRL',
        amount: 321.54
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('From currency not found')
  })

  it('should register another currency', async () => {
    const response = await request(app)
      .post('/currencies')
      .send({ currency: 'JPY' })

    expect(response.status).toBe(201)
  })

  it('should remove a currency', async () => {
    const { body: { _id: id } } = await request(app)
      .post('/currencies')
      .send({ currency: 'USDCAD' })

    const response = await request(app)
      .delete(`/currencies/${id}`)

    expect(response.status).toBe(204)
  })
})
