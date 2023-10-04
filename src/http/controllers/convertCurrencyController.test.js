import { describe, expect, it, beforeAll } from 'vitest'
import { App } from '../../app.js'
import request from 'supertest'
import { Connection } from '../../database/connection/connection.js'
import 'dotenv/config.js'

describe('Convert Currency Controller', async () => {
  const app = new App().server
  beforeAll(async () => {
    await Connection.connect(process.env.DATABASE_MONGO_TMPFS_URL)
  })

  it('should return conversion between two currencies', async () => {
    const response = await request(app)
      .get('/currency/convert/?from=BRL&to=BTC&amount=90')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body.converted).toBeTypeOf('number')
  })

  it('should return an error not found', async () => {
    const response = await request(app)
      .get('/currency/convert/?from=BRL&to=FAKE&amount=90')
      .expect('Content-Type', /json/)
      .expect(404)

    expect(response.body.message).toEqual('Currency not found: FAKE')
  })
  it('should return an error not found', async () => {
    const response = await request(app)
      .get('/currency/convert/?from=FAKE&to=EUR&amount=90')
      .expect('Content-Type', /json/)
      .expect(404)

    expect(response.body.message).toEqual('Currency not found: FAKE')
  })
})
