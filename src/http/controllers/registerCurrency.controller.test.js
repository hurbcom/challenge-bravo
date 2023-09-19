import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { App } from '../../app.js'
import CurrencyMongoRepository from '../../database/currencyMongoRepository.js'
describe('Register Controller', async () => {
  await CurrencyMongoRepository.connect()
  const app = new App().server

  it('should register an currency', async () => {
    const response = await request(app)
      .post('/currency/')
      .send({ code: 'HMG', price: 0.876 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)

    expect(response.body.id).toBeTruthy()
  })

  it('should return an http 400 error with message "currency already registered" ', async () => {
    const response = await request(app)
      .post('/currency/')
      .send({ code: 'BRL', price: 4.9867 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
    expect(response.body).toMatchObject({ message: 'Currency already registered' })
  })
})
